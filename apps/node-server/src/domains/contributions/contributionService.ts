import { prisma } from "../../lib/prisma";
import { createActivityEventData } from "../../services/activityFeedService";

export const getContributionsData = async () => {
  return prisma.contribution.findMany({
    include: {
      project: true,
      supportRequest: true,
      commonsPool: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createContributionData = async (
  projectId: number | null,
  contributorName: string,
  resourceType: string,
  amount: number,
  supportRequestId?: number | null,
  commonsPoolId?: number | null
) => {
  const contribution =
    await prisma.contribution.create({
      data: {
        projectId,
        contributorName,
        resourceType,
        amount,
        supportRequestId,
        commonsPoolId
      },
      include: {
        project: true,
        supportRequest: true,
        commonsPool: true
      }
    });

  let activityMessage =
    `${contributorName} contributed ${amount} ${resourceType}.`;

  if (contribution.project) {
    activityMessage =
      `${contributorName} contributed ${amount} ${resourceType} to ${contribution.project.title}.`;
  }

  if (contribution.supportRequest) {
    activityMessage =
      `${contributorName} contributed ${amount} ${resourceType} to support request "${contribution.supportRequest.title}".`;
  }

  if (contribution.commonsPool) {
    activityMessage =
      `${contributorName} contributed ${amount} ${resourceType} to commons pool "${contribution.commonsPool.name}".`;
  }

  await createActivityEventData(
    "contribution",
    "Contribution Recorded",
    activityMessage,
    contribution.project
      ? "project"
      : contribution.supportRequest
      ? "supportRequest"
      : contribution.commonsPool
      ? "commonsPool"
      : "contribution",
    contribution.projectId ??
      contribution.supportRequestId ??
      contribution.commonsPoolId ??
      contribution.id,
    contribution.project?.tribeId,
    contributorName
  );

  return contribution;
};