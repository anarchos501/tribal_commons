import { prisma } from "../../lib/prisma";

export const getFederationRelationshipsData = async (
  sourceTribeId: number
) => {
  return prisma.federationRelationship.findMany({
    where: {
      sourceTribeId,
      sourceTribe: {
        deletedAt: null
      },
      targetTribe: {
        deletedAt: null
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createFederationRelationshipData = async (
  sourceTribeId: number,
  targetTribeId: number,
  relationshipType: string,
  note?: string
) => {
  return prisma.federationRelationship.create({
    data: {
      sourceTribeId,
      targetTribeId,
      relationshipType,
      note
    }
  });
};
