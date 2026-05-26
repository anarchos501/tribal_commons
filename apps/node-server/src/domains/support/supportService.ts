import { prisma } from "../../lib/prisma";
import { createActivityEventData } from "../../services/activityFeedService";
import { resolveCharacterIdentity } from "../characters/characterIdentity";

export const getSupportRequestsData = async () => {
  return prisma.supportRequest.findMany({
    where: {
      OR: [
        {
          tribeId: null
        },
        {
          tribe: {
            deletedAt: null
          }
        }
      ]
    },
    include: {
      tribe: true,
      requesterCharacter: true,
      project: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createSupportRequestData = async (
  tribeId: number | null,
  requesterName: string | undefined,
  title: string,
  description: string,
  resourceType: string,
  amountRequested: number,
  supportType: string,
  requesterCharacterId?: number | null,
  projectId?: number | null
) => {
  const requesterIdentity =
    await resolveCharacterIdentity(
      requesterCharacterId,
      requesterName
    );

  if (!requesterIdentity.characterName) {
    throw new Error(
      "requesterName or requesterCharacterId is required"
    );
  }

  const supportRequest =
    await prisma.supportRequest.create({
      data: {
        tribeId,
        requesterName: requesterIdentity.characterName,
        title,
        description,
        resourceType,
        amountRequested,
        supportType,
        requesterCharacterId:
          requesterIdentity.characterProfileId,
        projectId,
        status: "open"
      },
      include: {
        tribe: true,
        requesterCharacter: true,
        project: true
      }
    });

  await createActivityEventData(
    "support",
    "Support Request Opened",
    `${supportRequest.requesterName} requested ${amountRequested} ${resourceType} for ${title}.`,
    "support",
    supportRequest.id,
    supportRequest.tribeId ?? undefined,
    supportRequest.requesterName,
    supportRequest.requesterCharacterId ?? undefined
  );

  return supportRequest;
};
