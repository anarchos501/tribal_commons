import { prisma } from "../../lib/prisma";

export const getTribesData = async () => {
  return prisma.tribe.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createTribeData = async (
  name: string,
  locality: string
) => {
  return prisma.tribe.create({
    data: {
      name,
      locality
    }
  });
};