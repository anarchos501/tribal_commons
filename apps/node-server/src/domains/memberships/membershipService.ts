import { prisma } from "../../lib/prisma";

export const getMembershipsData = async () => {
  return prisma.membership.findMany({
    where: {
      tribe: {
        deletedAt: null
      },
      OR: [
        {
          characterProfileId: null
        },
        {
          characterProfile: {
            deletedAt: null
          }
        }
      ]
    },
    include: {
      tribe: true,
      characterProfile: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createMembershipData = async (
  tribeId: number,
  role: string,
  characterProfileId?: number
) => {
  return prisma.membership.create({
    data: {
      tribeId,
      role,
      characterProfileId
    },
    include: {
      tribe: true,
      characterProfile: true
    }
  });
};
