import { prisma } from "../lib/prisma";
import { resolveCharacterIdentity } from "../domains/characters/characterIdentity";

export const getActivityFeedData = async () => {
  return prisma.activityEvent.findMany({
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
  actorCharacterId?: number
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
      actorCharacterId: actorIdentity.characterProfileId
    }
  });
};
