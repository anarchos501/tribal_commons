import { prisma } from "../../lib/prisma";
import { createActivityEventData } from "../../services/activityFeedService";
import { resolveCharacterIdentity } from "../characters/characterIdentity";
import { calculateThresholdReadiness } from "../policies/readiness";
import { getGovernanceTemperatureForTopicKeyData } from "../policies/policyService";

type RequestedFromType =
  | "individuals"
  | "tribal_commons_pool"
  | "project_resource_pool";

const requestedFromTypes = [
  "individuals",
  "tribal_commons_pool",
  "project_resource_pool"
];

const getRequestedFromType = (
  requestedFromType?: string,
  supportType?: string,
  projectId?: number | null
): RequestedFromType => {
  if (
    requestedFromType &&
    requestedFromTypes.includes(requestedFromType)
  ) {
    return requestedFromType as RequestedFromType;
  }

  if (supportType === "commons") {
    return "tribal_commons_pool";
  }

  if (supportType === "both" && projectId) {
    return "project_resource_pool";
  }

  return "individuals";
};

const getFulfillment = (
  amountRequested: number,
  contributions: Array<{ amount: number }>
) => {
  const contributedAmount = contributions.reduce(
    (sum, contribution) => sum + contribution.amount,
    0
  );

  return {
    amountRequested,
    contributedAmount,
    remainingAmount: Math.max(
      0,
      amountRequested - contributedAmount
    )
  };
};

const countEligibleTribeParticipants = async (
  tribeId: number
) => {
  return prisma.membership.count({
    where: {
      tribeId,
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
    }
  });
};

const countEligibleProjectParticipants = async (
  projectId: number
) => {
  return prisma.projectMembership.count({
    where: {
      projectId,
      removedAt: null,
      project: {
        tribe: {
          deletedAt: null
        }
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
    }
  });
};

const countCurrentSupport = (
  supports: Array<{
    value: number;
    supporterCharacter?: {
      deletedAt?: Date | string | null;
    } | null;
  }>
) => {
  return supports.filter(
    (support) =>
      support.value === 1 &&
      !support.supporterCharacter?.deletedAt
  ).length;
};

export const addSupportRequestReadiness = async <
  TSupportRequest extends {
    id: number;
    tribeId?: number | null;
    projectId?: number | null;
    requestedFromType: string;
    amountRequested: number;
    contributions?: Array<{ amount: number }>;
    supports?: Array<{
      value: number;
      supporterCharacter?: {
        deletedAt?: Date | string | null;
      } | null;
    }>;
  }
>(
  supportRequest: TSupportRequest
) => {
  const fulfillment = getFulfillment(
    supportRequest.amountRequested,
    supportRequest.contributions ?? []
  );

  if (supportRequest.requestedFromType === "individuals") {
    return {
      ...supportRequest,
      approvalRequired: false,
      readiness: null,
      fulfillment
    };
  }

  if (
    supportRequest.requestedFromType ===
    "tribal_commons_pool"
  ) {
    if (!supportRequest.tribeId) {
      return {
        ...supportRequest,
        approvalRequired: true,
        readiness: null,
        fulfillment
      };
    }

    const [eligibleParticipantCount, temperature] =
      await Promise.all([
        countEligibleTribeParticipants(
          supportRequest.tribeId
        ),
        getGovernanceTemperatureForTopicKeyData(
          supportRequest.tribeId,
          "support_request_approval_threshold"
        )
      ]);

    return {
      ...supportRequest,
      approvalRequired: true,
      readiness: calculateThresholdReadiness({
        eligibleParticipantCount,
        requiredSignaturePercentage:
          temperature.requiredSignaturePercentage,
        currentSupportCount: countCurrentSupport(
          supportRequest.supports ?? []
        )
      }),
      fulfillment
    };
  }

  if (
    supportRequest.requestedFromType ===
    "project_resource_pool"
  ) {
    if (!supportRequest.projectId) {
      return {
        ...supportRequest,
        approvalRequired: true,
        readiness: null,
        fulfillment
      };
    }

    const project = await prisma.project.findFirst({
      where: {
        id: supportRequest.projectId,
        tribe: {
          deletedAt: null
        }
      }
    });

    if (!project) {
      return {
        ...supportRequest,
        approvalRequired: true,
        readiness: null,
        fulfillment
      };
    }

    const [eligibleParticipantCount, temperature] =
      await Promise.all([
        countEligibleProjectParticipants(project.id),
        getGovernanceTemperatureForTopicKeyData(
          project.tribeId,
          "project_support_request_approval_threshold",
          "project",
          project.id
        )
      ]);

    return {
      ...supportRequest,
      approvalRequired: true,
      readiness: calculateThresholdReadiness({
        eligibleParticipantCount,
        requiredSignaturePercentage:
          temperature.requiredSignaturePercentage,
        currentSupportCount: countCurrentSupport(
          supportRequest.supports ?? []
        )
      }),
      fulfillment
    };
  }

  return {
    ...supportRequest,
    approvalRequired: false,
    readiness: null,
    fulfillment
  };
};

export const getSupportRequestsData = async () => {
  const supportRequests = await prisma.supportRequest.findMany({
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
      project: true,
      commonsPool: true,
      contributions: true,
      supports: {
        include: {
          supporterCharacter: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return Promise.all(
    supportRequests.map(addSupportRequestReadiness)
  );
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
  projectId?: number | null,
  requestedFromType?: string,
  commonsPoolId?: number | null
) => {
  const resolvedRequestedFromType = getRequestedFromType(
    requestedFromType,
    supportType,
    projectId
  );

  if (
    resolvedRequestedFromType === "tribal_commons_pool" &&
    (!tribeId || !commonsPoolId)
  ) {
    throw new Error(
      "tribeId and commonsPoolId are required for tribal commons pool requests"
    );
  }

  if (
    resolvedRequestedFromType === "project_resource_pool" &&
    !projectId
  ) {
    throw new Error(
      "projectId is required for project resource pool requests"
    );
  }

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
        requestedFromType: resolvedRequestedFromType,
        requesterCharacterId:
          requesterIdentity.characterProfileId,
        projectId,
        commonsPoolId,
        status: "open"
      },
      include: {
        tribe: true,
        requesterCharacter: true,
        project: true,
        commonsPool: true,
        contributions: true,
        supports: {
          include: {
            supporterCharacter: true
          }
        }
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

  return addSupportRequestReadiness(supportRequest);
};

export const supportSupportRequestData = async (
  supportRequestId: number,
  supporterName?: string,
  supporterCharacterId?: number | null
) => {
  const supporterIdentity =
    await resolveCharacterIdentity(
      supporterCharacterId,
      supporterName
    );

  if (!supporterIdentity.characterName) {
    throw new Error(
      "supporterName or supporterCharacterId is required"
    );
  }

  const supportRequest =
    await prisma.supportRequest.findUnique({
      where: {
        id: supportRequestId
      }
    });

  if (!supportRequest) {
    throw new Error("Support request not found");
  }

  if (
    supportRequest.requestedFromType === "individuals"
  ) {
    throw new Error(
      "Peer support requests do not require approval signatures"
    );
  }

  const support =
    await prisma.supportRequestSupport.upsert({
      where: {
        supportRequestId_supporterName: {
          supportRequestId,
          supporterName:
            supporterIdentity.characterName
        }
      },
      create: {
        supportRequestId,
        supporterName:
          supporterIdentity.characterName,
        supporterCharacterId:
          supporterIdentity.characterProfileId,
        value: 1
      },
      update: {
        supporterCharacterId:
          supporterIdentity.characterProfileId,
        value: 1
      },
      include: {
        supporterCharacter: true,
        supportRequest: true
      }
    });

  await createActivityEventData(
    "support",
    "Support Request Approved",
    `${support.supporterName} supported approval for "${support.supportRequest.title}".`,
    "support",
    support.supportRequestId,
    support.supportRequest.tribeId ?? undefined,
    support.supporterName,
    support.supporterCharacterId ?? undefined
  );

  return support;
};
