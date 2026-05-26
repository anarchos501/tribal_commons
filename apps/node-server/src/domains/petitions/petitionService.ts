import { prisma } from "../../lib/prisma";
import { createActivityEventData } from "../../services/activityFeedService";
import { resolveCharacterIdentity } from "../characters/characterIdentity";

type CreatePetitionInput = {
  type: string;
  title: string;
  description: string;
  tribeId: number;
  proposerName?: string;
  proposerCharacterId?: number | null;
  projectId?: number | null;
  targetTribeId?: number | null;
  metadata?: unknown;
};

const validPetitionTypes = ["project", "federation"];

export const getPetitionsData = async (
  tribeId?: number,
  type?: string,
  status?: string
) => {
  return prisma.petition.findMany({
    where: {
      ...(tribeId
        ? {
            tribeId
          }
        : {}),
      ...(type
        ? {
            type
          }
        : {}),
      ...(status
        ? {
            status
          }
        : {}),
      tribe: {
        deletedAt: null
      }
    },
    include: {
      tribe: true,
      targetTribe: true,
      project: true,
      proposerCharacter: true,
      supports: {
        include: {
          supporterCharacter: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createPetitionData = async ({
  type,
  title,
  description,
  tribeId,
  proposerName,
  proposerCharacterId,
  projectId,
  targetTribeId,
  metadata
}: CreatePetitionInput) => {
  if (!validPetitionTypes.includes(type)) {
    throw new Error("Invalid petition type");
  }

  const proposerIdentity =
    await resolveCharacterIdentity(
      proposerCharacterId,
      proposerName
    );

  if (!proposerIdentity.characterName) {
    throw new Error(
      "proposerName or proposerCharacterId is required"
    );
  }

  const petition = await prisma.petition.create({
    data: {
      type,
      title,
      description,
      tribeId,
      projectId,
      targetTribeId,
      proposerName: proposerIdentity.characterName,
      proposerCharacterId:
        proposerIdentity.characterProfileId,
      metadata: metadata as any,
      status: "open"
    },
    include: {
      tribe: true,
      targetTribe: true,
      project: true,
      supports: true
    }
  });

  await createActivityEventData(
    "petition",
    "Petition Opened",
    `${petition.proposerName} opened ${type} petition "${petition.title}".`,
    "petition",
    petition.id,
    petition.tribeId,
    petition.proposerName,
    petition.proposerCharacterId ?? undefined
  );

  return petition;
};

export const supportPetitionData = async (
  petitionId: number,
  supporterName?: string,
  supporterCharacterId?: number | null
) => {
  const supporterIdentity =
    await resolveCharacterIdentity(
      supporterCharacterId,
      supporterName
    );

  if (!supporterIdentity.characterName) {
    throw new Error(
      "supporterName or supporterCharacterId is required"
    );
  }

  const support = await prisma.petitionSupport.create({
    data: {
      petitionId,
      supporterName: supporterIdentity.characterName,
      supporterCharacterId:
        supporterIdentity.characterProfileId
    },
    include: {
      petition: true,
      supporterCharacter: true
    }
  });

  await createActivityEventData(
    "petition",
    "Petition Supported",
    `${support.supporterName} supported petition "${support.petition.title}".`,
    "petition",
    support.petitionId,
    support.petition.tribeId,
    support.supporterName,
    support.supporterCharacterId ?? undefined
  );

  return support;
};
