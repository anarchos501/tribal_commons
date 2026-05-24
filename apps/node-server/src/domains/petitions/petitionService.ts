import { prisma } from "../../lib/prisma";

export const getPetitionsData = async () => {
  return prisma.petition.findMany({
    include: {
      project: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createPetitionData = async (
  projectId: number,
  signer: string
) => {
  return prisma.petition.create({
    data: {
      projectId,
      signer
    },
    include: {
      project: true
    }
  });
};