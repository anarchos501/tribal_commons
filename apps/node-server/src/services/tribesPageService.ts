import { prisma } from "../lib/prisma";

export const getTribesPageData = async () => {
  return prisma.tribe.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
};