import { prisma } from "../../lib/prisma";

export const getCommonsPoolsData = async () => {
  return prisma.commonsPool.findMany({
    include: {
      tribe: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createCommonsPoolData = async (
  tribeId: number,
  name: string,
  description: string
) => {
  return prisma.commonsPool.create({
    data: {
      tribeId,
      name,
      description
    },
    include: {
      tribe: true
    }
  });
};