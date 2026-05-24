import { prisma } from "../../lib/prisma";

export const getMembershipsData = async () => {
  return prisma.membership.findMany({
    include: {
      tribe: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createMembershipData = async (
  tribeId: number,
  role: string
) => {
  return prisma.membership.create({
    data: {
      tribeId,
      role
    },
    include: {
      tribe: true
    }
  });
};