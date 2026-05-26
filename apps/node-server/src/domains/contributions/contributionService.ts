import { prisma } from "../../lib/prisma";
import { createActivityEventData } from "../../services/activityFeedService";

export const getContributionsData = async () => {
  return prisma.contribution.findMany({
    include: {
      project: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createContributionData = async (
  projectId: number,
  playerName: string,
  resourceType: string,
  amount: number
) => {
  const contribution = await prisma.contribution.create({
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
    "contribution",
    "Contribution Recorded",
    `${playerName} contributed ${amount} ${resourceType} to ${contribution.project.title}.`,
    "project",
    contribution.projectId,
    contribution.project.tribeId,
    playerName
  );

  return contribution;
};