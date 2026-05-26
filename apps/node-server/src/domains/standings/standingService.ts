import { prisma } from "../../lib/prisma";
import { resolveCharacterIdentity } from "../characters/characterIdentity";

export const getPersonalStandingsData = async (
  observerName?: string,
  observerCharacterId?: number
) => {
  const observerFilters = [
    ...(observerCharacterId
      ? [
          {
            observerCharacterId
          }
        ]
      : []),
    ...(observerName
      ? [
          {
            observerName
          }
        ]
      : [])
  ];

  return prisma.personalStanding.findMany({
    where:
      observerFilters.length > 0
        ? {
            OR: observerFilters
          }
        : {},
    orderBy: {
      updatedAt: "desc"
    }
  });
};

export const createPersonalStandingData = async (
  observerName: string | undefined,
  subjectType: string,
  subjectName: string | undefined,
  value: number,
  note?: string,
  tribeContextId?: number,
  observerCharacterId?: number | null,
  subjectCharacterId?: number | null
) => {
  const observerIdentity =
    await resolveCharacterIdentity(
      observerCharacterId,
      observerName
    );

  const subjectIdentity =
    await resolveCharacterIdentity(
      subjectCharacterId,
      subjectName
    );

  if (!observerIdentity.characterName) {
    throw new Error(
      "observerName or observerCharacterId is required"
    );
  }

  if (!subjectIdentity.characterName) {
    throw new Error(
      "subjectName or subjectCharacterId is required"
    );
  }

  return prisma.personalStanding.create({
    data: {
      observerName: observerIdentity.characterName,
      subjectType,
      subjectName: subjectIdentity.characterName,
      value,
      note,
      tribeContextId,
      visibility: "private",
      observerCharacterId:
        observerIdentity.characterProfileId,
      subjectCharacterId:
        subjectIdentity.characterProfileId
    }
  });
};
