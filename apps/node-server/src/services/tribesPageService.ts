import { prisma } from "../lib/prisma";

export const getTribesPageData = async () => {
  return prisma.tribe.findMany({
    where: {
      deletedAt: null
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
