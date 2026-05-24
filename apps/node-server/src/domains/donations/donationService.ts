import { prisma } from "../../lib/prisma";

export const getDonationsData = async () => {
  return prisma.donation.findMany({
    include: {
      project: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createDonationData = async (
  projectId: number,
  playerName: string,
  resourceType: string,
  amount: number
) => {
  return prisma.donation.create({
    data: {
      projectId,
      playerName,
      resourceType,
      amount
    },
    include: {
      project: true
    }
  });
};