import { prisma } from "../../lib/prisma";
import { calculateThresholdReadiness } from "../policies/readiness";
import { getGovernanceTemperatureForTopicKeyData } from "../policies/policyService";

type PetitionSignature = {
  sponsorName?: string;
  sponsorCharacterId?: number | null;
  sponsorCharacter?: {
    deletedAt?: Date | string | null;
  } | null;
  supporterName?: string;
  supporterCharacterId?: number | null;
  supporterCharacter?: {
    deletedAt?: Date | string | null;
  } | null;
};

type PetitionWithReadinessInput = {
  id: number;
  type: string;
  tribeId: number;
  sponsors?: PetitionSignature[];
  supports?: PetitionSignature[];
};

const getSignatureKey = (signature: PetitionSignature) => {
  if (
    signature.sponsorCharacter?.deletedAt ||
    signature.supporterCharacter?.deletedAt
  ) {
    return null;
  }

  const characterId =
    signature.sponsorCharacterId ??
    signature.supporterCharacterId;

  if (characterId) {
    return `character:${characterId}`;
  }

  const name =
    signature.sponsorName ?? signature.supporterName;

  return name ? `name:${name.toLowerCase()}` : null;
};

const countUniqueSignatures = (
  petition: PetitionWithReadinessInput
) => {
  const signatureKeys = new Set<string>();

  for (const sponsor of petition.sponsors ?? []) {
    const key = getSignatureKey(sponsor);

    if (key) {
      signatureKeys.add(key);
    }
  }

  for (const support of petition.supports ?? []) {
    const key = getSignatureKey(support);

    if (key) {
      signatureKeys.add(key);
    }
  }

  return signatureKeys.size;
};

const countEligibleTribeParticipants = async (
  tribeId: number
) => {
  return prisma.membership.count({
    where: {
      tribeId,
      tribe: {
        deletedAt: null
      },
      OR: [
        {
          characterProfileId: null
        },
        {
          characterProfile: {
            deletedAt: null
          }
        }
      ]
    }
  });
};

export const addProjectPetitionReadiness = async <
  TPetition extends PetitionWithReadinessInput
>(
  petitions: TPetition[]
) => {
  const tribeIds = Array.from(
    new Set(
      petitions
        .filter((petition) => petition.type === "project")
        .map((petition) => petition.tribeId)
    )
  );

  const tribeReadinessContext = new Map<
    number,
    {
      eligibleParticipantCount: number;
      requiredSignaturePercentage: number;
    }
  >();

  for (const tribeId of tribeIds) {
    const [eligibleParticipantCount, temperature] =
      await Promise.all([
        countEligibleTribeParticipants(tribeId),
        getGovernanceTemperatureForTopicKeyData(
          tribeId,
          "project_activation_threshold"
        )
      ]);

    tribeReadinessContext.set(tribeId, {
      eligibleParticipantCount,
      requiredSignaturePercentage:
        temperature.requiredSignaturePercentage
    });
  }

  return petitions.map((petition) => {
    if (petition.type !== "project") {
      return {
        ...petition,
        readiness: null
      };
    }

    const context = tribeReadinessContext.get(
      petition.tribeId
    );

    if (!context) {
      return {
        ...petition,
        readiness: null
      };
    }

    return {
      ...petition,
      readiness: calculateThresholdReadiness({
        ...context,
        currentSupportCount:
          countUniqueSignatures(petition)
      })
    };
  });
};
