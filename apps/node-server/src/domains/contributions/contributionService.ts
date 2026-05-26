import { prisma } from "../../lib/prisma";
import { createActivityEventData } from "../../services/activityFeedService";
import { resolveCharacterIdentity } from "../characters/characterIdentity";

export const getContributionsData = async () => {
  return prisma.contribution.findMany({
    include: {
      project: true,
      supportRequest: true,
      commonsPool: true,
      contributorCharacter: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createContributionData = async (
  projectId: number | null,
  contributorName: string | undefined,
  resourceType: string,
  amount: number,
  supportRequestId?: number | null,
  commonsPoolId?: number | null,
  contributorCharacterId?: number | null
) => {
  const targetCount = [
    projectId,
    supportRequestId,
    commonsPoolId
  ].filter((targetId) => targetId != null).length;

  if (targetCount !== 1) {
    throw new Error(
      "Contribution must target exactly one project, support request, or commons pool"
    );
  }

  const contributorIdentity =
    await resolveCharacterIdentity(
      contributorCharacterId,
      contributorName
    );

  if (!contributorIdentity.characterName) {
    throw new Error(
      "contributorName or contributorCharacterId is required"
    );
  }

  const contribution =
    await prisma.contribution.create({
      data: {
        projectId,
        contributorName:
          contributorIdentity.characterName,
        resourceType,
        amount,
        supportRequestId,
        commonsPoolId,
        contributorCharacterId:
          contributorIdentity.characterProfileId
      },
      include: {
        project: true,
        supportRequest: true,
        commonsPool: true,
        contributorCharacter: true
      }
    });

  let activityMessage =
    `${contribution.contributorName} contributed ${amount} ${resourceType}.`;

  if (contribution.project) {
    activityMessage =
      `${contribution.contributorName} contributed ${amount} ${resourceType} to ${contribution.project.title}.`;
  }

  if (contribution.supportRequest) {
    activityMessage =
      `${contribution.contributorName} contributed ${amount} ${resourceType} to support request "${contribution.supportRequest.title}".`;
  }

  if (contribution.commonsPool) {
    activityMessage =
      `${contribution.contributorName} contributed ${amount} ${resourceType} to commons pool "${contribution.commonsPool.name}".`;
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
    contribution.contributorName,
    contribution.contributorCharacterId ?? undefined
  );

  return contribution;
};
