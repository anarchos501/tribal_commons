import { prisma } from "../../lib/prisma";
import { createActivityEventData } from "../../services/activityFeedService";

export const getSupportRequestsData = async () => {
  return prisma.supportRequest.findMany({
    include: {
      tribe: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createSupportRequestData = async (
  tribeId: number,
  requesterName: string,
  title: string,
  description: string,
  resourceType: string,
  amountRequested: number,
  supportType: string
) => {
  const supportRequest =
    await prisma.supportRequest.create({
      data: {
        tribeId,
        requesterName,
        title,
        description,
        resourceType,
        amountRequested,
        supportType,
        status: "open"
      },
      include: {
        tribe: true
      }
    });

  await createActivityEventData(
    "support",
    "Support Request Opened",
    `${requesterName} requested ${amountRequested} ${resourceType} for ${title}.`,
    "support",
    supportRequest.id,
    supportRequest.tribeId ?? undefined,
    requesterName
  );

  return supportRequest;
};