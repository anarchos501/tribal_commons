import { prisma } from "../../lib/prisma";
import { createActivityEventData } from "../../services/activityFeedService";

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
  const donation = await prisma.donation.create({
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

  await createActivityEventData(
    "donation",
    "Contribution Recorded",
    `${playerName} contributed ${amount} ${resourceType} to ${donation.project.title}.`,
    "project",
    donation.projectId,
    donation.project.tribeId,
    playerName
  );

  return donation;
};