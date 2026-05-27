import { prisma } from "../lib/prisma";
import { resolveCharacterIdentity } from "../domains/characters/characterIdentity";

export const getActivityFeedData = async (
  characterProfileId?: number
) => {
  return prisma.activityEvent.findMany({
    where: characterProfileId
      ? {
          OR: [
            {
              visibleToCharacterIds: {
                isEmpty: true
              }
            },
            {
              visibleToCharacterIds: {
                has: characterProfileId
              }
            }
          ]
        }
      : {
          visibleToCharacterIds: {
            isEmpty: true
          }
        },
    orderBy: {
      createdAt: "desc"
    },
    take: 50
  });
};

export const createActivityEventData = async (
  type: string,
  title: string,
  message: string,
  entityType?: string,
  entityId?: number,
  tribeId?: number,
  actorName?: string,
  actorCharacterId?: number,
  visibleToCharacterIds: number[] = []
) => {
  const actorIdentity = await resolveCharacterIdentity(
    actorCharacterId,
    actorName
  );

  return prisma.activityEvent.create({
    data: {
      type,
      title,
      message,
      entityType,
      entityId,
      tribeId,
      actorName: actorIdentity.characterName,
      actorCharacterId: actorIdentity.characterProfileId,
      visibleToCharacterIds
    }
  });
};
