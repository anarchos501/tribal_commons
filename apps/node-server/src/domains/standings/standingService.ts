import { prisma } from "../../lib/prisma";

export const getPersonalStandingsData = async (
  observerName: string
) => {
  return prisma.personalStanding.findMany({
    where: {
      observerName
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
};

export const createPersonalStandingData = async (
  observerName: string,
  subjectType: string,
  subjectName: string,
  value: number,
  note?: string,
  tribeContextId?: number
) => {
  return prisma.personalStanding.create({
    data: {
      observerName,
      subjectType,
      subjectName,
      value,
      note,
      tribeContextId,
      visibility: "private"
    }
  });
};