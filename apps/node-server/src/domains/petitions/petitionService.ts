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
  sponsorNames?: string[];
  sponsorCharacterIds?: number[];
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
      sponsors: {
        include: {
          sponsorCharacter: true
        },
        orderBy: {
          createdAt: "asc"
        }
      },
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
  sponsorNames,
  sponsorCharacterIds,
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

  const sponsorSnapshots = new Map<
    string,
    {
      sponsorName: string;
      sponsorCharacterId?: number | null;
    }
  >();

  sponsorSnapshots.set(proposerIdentity.characterName, {
    sponsorName: proposerIdentity.characterName,
    sponsorCharacterId:
      proposerIdentity.characterProfileId
  });

  for (const sponsorName of sponsorNames ?? []) {
    const trimmedName = sponsorName.trim();

    if (trimmedName) {
      sponsorSnapshots.set(trimmedName, {
        sponsorName: trimmedName
      });
    }
  }

  if (sponsorCharacterIds?.length) {
    const sponsorCharacters =
      await prisma.characterProfile.findMany({
        where: {
          id: {
            in: sponsorCharacterIds
          },
          deletedAt: null
        }
      });

    for (const character of sponsorCharacters) {
      sponsorSnapshots.set(character.characterName, {
        sponsorName: character.characterName,
        sponsorCharacterId: character.id
      });
    }
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
      sponsors: {
        create: Array.from(sponsorSnapshots.values())
      },
      metadata: metadata as any,
      status: "open"
    },
    include: {
      tribe: true,
      targetTribe: true,
      project: true,
      supports: true,
      sponsors: true
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
