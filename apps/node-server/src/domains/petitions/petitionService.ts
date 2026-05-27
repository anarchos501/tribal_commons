import { prisma } from "../../lib/prisma";
import { createActivityEventData } from "../../services/activityFeedService";
import { resolveCharacterIdentity } from "../characters/characterIdentity";
import { calculateThresholdReadiness } from "../policies/readiness";
import {
  getGovernanceTemperatureForTopicKeyData,
  seedDefaultGovernanceTopicsForPetition
} from "../policies/policyService";
import { addProjectPetitionReadiness } from "./petitionReadiness";

type CreatePetitionInput = {
  type: string;
  title: string;
  description: string;
  tribeId: number;
  proposerName?: string;
  proposerCharacterId?: number | null;
  sponsorNames?: string[];
  sponsorCharacterIds?: number[];
  projectId?: number | null;
  targetTribeId?: number | null;
  publishDuration?: "24h" | "3d" | "7d";
  metadata?: unknown;
};

const validPetitionTypes = ["project", "federation"];
const validPublishDurations = {
  "24h": 24,
  "3d": 72,
  "7d": 168
};

const getPublishAt = (
  publishDuration?: "24h" | "3d" | "7d"
) => {
  const hours =
    validPublishDurations[publishDuration ?? "3d"];

  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

const getCharacterIdsForPrivatePetition = async (
  petitionId: number
) => {
  const petition = await prisma.petition.findUnique({
    where: {
      id: petitionId
    },
    include: {
      sponsors: {
        where: {
          removedAt: null
        }
      },
      sponsorRequests: {
        where: {
          status: "pending"
        }
      }
    }
  });

  if (!petition) {
    return [];
  }

  return Array.from(
    new Set(
      [
        petition.proposerCharacterId,
        ...petition.sponsors.map(
          (sponsor) => sponsor.sponsorCharacterId
        ),
        ...petition.sponsorRequests.flatMap((request) => [
          request.requesterCharacterId,
          request.recipientCharacterId
        ])
      ].filter(
        (id): id is number => typeof id === "number"
      )
    )
  );
};

const requireActiveSponsor = async (
  petitionId: number,
  characterName: string
) => {
  const sponsor = await prisma.petitionSponsor.findUnique({
    where: {
      petitionId_sponsorName: {
        petitionId,
        sponsorName: characterName
      }
    }
  });

  if (!sponsor || sponsor.removedAt) {
    throw new Error("Active sponsor is required");
  }

  return sponsor;
};

const getActiveSponsorCount = async (petitionId: number) => {
  return prisma.petitionSponsor.count({
    where: {
      petitionId,
      removedAt: null,
      OR: [
        {
          sponsorCharacterId: null
        },
        {
          sponsorCharacter: {
            deletedAt: null
          }
        }
      ]
    }
  });
};

const getSponsorRequestReadiness = async (
  sponsorRequestId: number
) => {
  const sponsorRequest =
    await prisma.petitionSponsorRequest.findUnique({
      where: {
        id: sponsorRequestId
      },
      include: {
        petition: true,
        preferences: true
      }
    });

  if (!sponsorRequest) {
    throw new Error("Sponsor request not found");
  }

  const temperature =
    await getGovernanceTemperatureForTopicKeyData(
      sponsorRequest.petition.tribeId,
      "petition_sponsor_approval_threshold",
      "petition",
      null,
      sponsorRequest.petitionId
    );

  const eligibleParticipantCount =
    await getActiveSponsorCount(
      sponsorRequest.petitionId
    );

  const approvalCount =
    sponsorRequest.preferences.filter(
      (preference) => preference.value === 1
    ).length;

  const declineCount =
    sponsorRequest.preferences.filter(
      (preference) => preference.value === -1
    ).length;

  return {
    approval: calculateThresholdReadiness({
      eligibleParticipantCount,
      requiredSignaturePercentage:
        temperature.requiredSignaturePercentage,
      currentSupportCount: approvalCount
    }),
    decline: calculateThresholdReadiness({
      eligibleParticipantCount,
      requiredSignaturePercentage:
        temperature.requiredSignaturePercentage,
      currentSupportCount: declineCount
    })
  };
};

const addSponsorRequestReadiness = async <
  TRequest extends {
    id: number;
    preferences?: unknown[];
  }
>(
  requests: TRequest[]
) => {
  return Promise.all(
    requests.map(async (request) => {
      const readiness =
        await getSponsorRequestReadiness(request.id);

      const { preferences, ...safeRequest } = request;

      void preferences;

      return {
        ...safeRequest,
        readiness
      };
    })
  );
};

export const withSponsorshipPayload = async <
  TPetition extends {
    sponsorRequests?: Array<{
      id: number;
      preferences?: unknown[];
    }>;
  }
>(
  petition: TPetition
) => {
  return {
    ...petition,
    sponsorRequests: petition.sponsorRequests
      ? await addSponsorRequestReadiness(
          petition.sponsorRequests
        )
      : []
  };
};

const archiveDraftIfSponsorless = async (
  petitionId: number
) => {
  const petition = await prisma.petition.findUnique({
    where: {
      id: petitionId
    }
  });

  if (!petition || petition.status !== "draft") {
    return;
  }

  const sponsorCount =
    await getActiveSponsorCount(petitionId);

  if (sponsorCount > 0) {
    return;
  }

  await prisma.petition.update({
    where: {
      id: petitionId
    },
    data: {
      status: "archived"
    }
  });

  await createActivityEventData(
    "petition",
    "Draft Archived",
    `Draft project petition "${petition.title}" was archived after all sponsors left.`,
    "petition",
    petition.id,
    petition.tribeId,
    "System",
    undefined,
    []
  );
};

export const getPetitionsData = async (
  tribeId?: number,
  type?: string,
  status?: string,
  currentCharacterId?: number
) => {
  const petitions = await prisma.petition.findMany({
    where: {
      ...(tribeId
        ? {
            tribeId
          }
        : {}),
      ...(type
        ? {
            type
          }
        : {}),
      ...(status
        ? {
            status
          }
        : {}),
      tribe: {
        deletedAt: null
      },
      ...(currentCharacterId
        ? {
            OR: [
              {
                status: {
                  not: "draft"
                }
              },
              {
                proposerCharacterId: currentCharacterId
              },
              {
                sponsors: {
                  some: {
                    sponsorCharacterId:
                      currentCharacterId,
                    removedAt: null
                  }
                }
              },
              {
                sponsorRequests: {
                  some: {
                    status: "pending",
                    recipientCharacterId:
                      currentCharacterId
                  }
                }
              }
            ]
          }
        : {
            status: {
              not: "draft"
            }
          })
    },
    include: {
      tribe: true,
      targetTribe: true,
      project: true,
      proposerCharacter: true,
      sponsors: {
        where: {
          removedAt: null
        },
        include: {
          sponsorCharacter: true
        },
        orderBy: {
          createdAt: "asc"
        }
      },
      supports: {
        include: {
          supporterCharacter: true
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      sponsorRequests: {
        include: {
          requesterCharacter: true,
          recipientCharacter: true,
          preferences: true
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

  const petitionsWithReadiness =
    await addProjectPetitionReadiness(petitions);

  return Promise.all(
    petitionsWithReadiness.map(withSponsorshipPayload)
  );
};

export const createPetitionData = async ({
  type,
  title,
  description,
  tribeId,
  proposerName,
  proposerCharacterId,
  sponsorNames,
  sponsorCharacterIds,
  projectId,
  targetTribeId,
  publishDuration,
  metadata
}: CreatePetitionInput) => {
  if (!validPetitionTypes.includes(type)) {
    throw new Error("Invalid petition type");
  }

  const proposerIdentity =
    await resolveCharacterIdentity(
      proposerCharacterId,
      proposerName
    );

  if (!proposerIdentity.characterName) {
    throw new Error(
      "proposerName or proposerCharacterId is required"
    );
  }

  const sponsorSnapshots = new Map<
    string,
    {
      sponsorName: string;
      sponsorCharacterId?: number | null;
    }
  >();

  sponsorSnapshots.set(proposerIdentity.characterName, {
    sponsorName: proposerIdentity.characterName,
    sponsorCharacterId:
      proposerIdentity.characterProfileId
  });

  for (const sponsorName of sponsorNames ?? []) {
    const trimmedName = sponsorName.trim();

    if (trimmedName) {
      sponsorSnapshots.set(trimmedName, {
        sponsorName: trimmedName
      });
    }
  }

  if (sponsorCharacterIds?.length) {
    const sponsorCharacters =
      await prisma.characterProfile.findMany({
        where: {
          id: {
            in: sponsorCharacterIds
          },
          deletedAt: null
        }
      });

    for (const character of sponsorCharacters) {
      sponsorSnapshots.set(character.characterName, {
        sponsorName: character.characterName,
        sponsorCharacterId: character.id
      });
    }
  }

  const status = type === "project" ? "draft" : "open";
  const publishAt =
    type === "project" ? getPublishAt(publishDuration) : null;

  const petition = await prisma.petition.create({
    data: {
      type,
      title,
      description,
      tribeId,
      projectId,
      targetTribeId,
      publishAt,
      proposerName: proposerIdentity.characterName,
      proposerCharacterId:
        proposerIdentity.characterProfileId,
      sponsors: {
        create: Array.from(sponsorSnapshots.values())
      },
      metadata: metadata as any,
      status
    },
    include: {
      tribe: true,
      targetTribe: true,
      project: true,
      supports: true,
      sponsors: true,
      sponsorRequests: true
    }
  });

  if (type === "project") {
    await seedDefaultGovernanceTopicsForPetition(
      petition.id
    );
  }

  await createActivityEventData(
    "petition",
    status === "draft"
      ? "Draft Project Petition Created"
      : "Petition Opened",
    status === "draft"
      ? `${petition.proposerName} drafted project petition "${petition.title}".`
      : `${petition.proposerName} opened ${type} petition "${petition.title}".`,
    "petition",
    petition.id,
    petition.tribeId,
    petition.proposerName,
    petition.proposerCharacterId ?? undefined,
    status === "draft" && petition.proposerCharacterId
      ? [petition.proposerCharacterId]
      : []
  );

  return petition;
};

export const supportPetitionData = async (
  petitionId: number,
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

  const support = await prisma.petitionSupport.create({
    data: {
      petitionId,
      supporterName: supporterIdentity.characterName,
      supporterCharacterId:
        supporterIdentity.characterProfileId
    },
    include: {
      petition: true,
      supporterCharacter: true
    }
  });

  await createActivityEventData(
    "petition",
    "Petition Supported",
    `${support.supporterName} supported petition "${support.petition.title}".`,
    "petition",
    support.petitionId,
    support.petition.tribeId,
    support.supporterName,
    support.supporterCharacterId ?? undefined
  );

  return support;
};

export const invitePetitionSponsorData = async (
  petitionId: number,
  inviterName?: string,
  inviterCharacterId?: number | null,
  recipientName?: string,
  recipientCharacterId?: number | null
) => {
  const inviterIdentity =
    await resolveCharacterIdentity(
      inviterCharacterId,
      inviterName
    );

  const recipientIdentity =
    await resolveCharacterIdentity(
      recipientCharacterId,
      recipientName
    );

  if (
    !inviterIdentity.characterName ||
    !recipientIdentity.characterName
  ) {
    throw new Error(
      "inviter and recipient identities are required"
    );
  }

  const petition = await prisma.petition.findUnique({
    where: {
      id: petitionId
    }
  });

  if (!petition || petition.type !== "project") {
    throw new Error("Project petition not found");
  }

  if (petition.status !== "draft") {
    throw new Error(
      "Sponsor invites are only available during draft"
    );
  }

  await requireActiveSponsor(
    petitionId,
    inviterIdentity.characterName
  );

  const existingSponsor =
    await prisma.petitionSponsor.findUnique({
      where: {
        petitionId_sponsorName: {
          petitionId,
          sponsorName: recipientIdentity.characterName
        }
      }
    });

  if (existingSponsor?.removedAt === null) {
    throw new Error("Character is already a sponsor");
  }

  const invite =
    await prisma.petitionSponsorRequest.create({
      data: {
        petitionId,
        requestType: "invite",
        status: "pending",
        requesterName: inviterIdentity.characterName,
        requesterCharacterId:
          inviterIdentity.characterProfileId,
        recipientName: recipientIdentity.characterName,
        recipientCharacterId:
          recipientIdentity.characterProfileId
      },
      include: {
        requesterCharacter: true,
        recipientCharacter: true,
        preferences: true
      }
    });

  await createActivityEventData(
    "petition",
    "Sponsor Invited",
    `${inviterIdentity.characterName} invited ${recipientIdentity.characterName} to sponsor draft project petition "${petition.title}".`,
    "petition",
    petition.id,
    petition.tribeId,
    inviterIdentity.characterName,
    inviterIdentity.characterProfileId ?? undefined,
    await getCharacterIdsForPrivatePetition(petition.id)
  );

  return withSponsorshipPayload({
    ...invite,
    sponsorRequests: undefined
  });
};

export const respondToSponsorInviteData = async (
  sponsorRequestId: number,
  responderName?: string,
  responderCharacterId?: number | null,
  response?: "accepted" | "declined"
) => {
  if (!["accepted", "declined"].includes(response ?? "")) {
    throw new Error("response must be accepted or declined");
  }

  const responderIdentity =
    await resolveCharacterIdentity(
      responderCharacterId,
      responderName
    );

  if (!responderIdentity.characterName) {
    throw new Error("responder identity is required");
  }

  const invite =
    await prisma.petitionSponsorRequest.findUnique({
      where: {
        id: sponsorRequestId
      },
      include: {
        petition: true
      }
    });

  if (
    !invite ||
    invite.requestType !== "invite" ||
    invite.status !== "pending"
  ) {
    throw new Error("Pending sponsor invite not found");
  }

  if (invite.petition.status !== "draft") {
    throw new Error("Draft invite is no longer active");
  }

  if (
    invite.recipientName !==
    responderIdentity.characterName
  ) {
    throw new Error("Only the invitee can respond");
  }

  const updated =
    await prisma.petitionSponsorRequest.update({
      where: {
        id: invite.id
      },
      data: {
        status: response
      },
      include: {
        requesterCharacter: true,
        recipientCharacter: true,
        preferences: true
      }
    });

  if (response === "accepted") {
    const existingSponsor =
      await prisma.petitionSponsor.findUnique({
        where: {
          petitionId_sponsorName: {
            petitionId: invite.petitionId,
            sponsorName:
              responderIdentity.characterName
          }
        }
      });

    if (existingSponsor) {
      await prisma.petitionSponsor.update({
        where: {
          id: existingSponsor.id
        },
        data: {
          removedAt: null,
          sponsorCharacterId:
            responderIdentity.characterProfileId
        }
      });
    } else {
      await prisma.petitionSponsor.create({
        data: {
          petitionId: invite.petitionId,
          sponsorName:
            responderIdentity.characterName,
          sponsorCharacterId:
            responderIdentity.characterProfileId
        }
      });
    }
  }

  await createActivityEventData(
    "petition",
    response === "accepted"
      ? "Sponsor Invite Accepted"
      : "Sponsor Invite Declined",
    `${responderIdentity.characterName} ${response} a sponsor invite for "${invite.petition.title}".`,
    "petition",
    invite.petitionId,
    invite.petition.tribeId,
    responderIdentity.characterName,
    responderIdentity.characterProfileId ?? undefined,
    await getCharacterIdsForPrivatePetition(
      invite.petitionId
    )
  );

  return withSponsorshipPayload({
    ...updated,
    sponsorRequests: undefined
  });
};

export const requestPetitionSponsorshipData = async (
  petitionId: number,
  requesterName?: string,
  requesterCharacterId?: number | null
) => {
  const requesterIdentity =
    await resolveCharacterIdentity(
      requesterCharacterId,
      requesterName
    );

  if (!requesterIdentity.characterName) {
    throw new Error("requester identity is required");
  }

  const petition = await prisma.petition.findUnique({
    where: {
      id: petitionId
    }
  });

  if (
    !petition ||
    petition.type !== "project" ||
    petition.status !== "open"
  ) {
    throw new Error(
      "Sponsorship requests are only available for open project petitions"
    );
  }

  const existingSponsor =
    await prisma.petitionSponsor.findUnique({
      where: {
        petitionId_sponsorName: {
          petitionId,
          sponsorName: requesterIdentity.characterName
        }
      }
    });

  if (existingSponsor?.removedAt === null) {
    throw new Error("Character is already a sponsor");
  }

  const existingPending =
    await prisma.petitionSponsorRequest.findFirst({
      where: {
        petitionId,
        requestType: "request",
        requesterName:
          requesterIdentity.characterName,
        status: "pending"
      }
    });

  if (existingPending) {
    throw new Error("Sponsor request is already pending");
  }

  const sponsorRequest =
    await prisma.petitionSponsorRequest.create({
      data: {
        petitionId,
        requestType: "request",
        status: "pending",
        requesterName:
          requesterIdentity.characterName,
        requesterCharacterId:
          requesterIdentity.characterProfileId
      },
      include: {
        requesterCharacter: true,
        recipientCharacter: true,
        preferences: true
      }
    });

  const visibleToCharacterIds =
    await getCharacterIdsForPrivatePetition(petition.id);

  if (requesterIdentity.characterProfileId) {
    visibleToCharacterIds.push(
      requesterIdentity.characterProfileId
    );
  }

  await createActivityEventData(
    "petition",
    "Sponsorship Requested",
    `${requesterIdentity.characterName} requested sponsorship for project petition "${petition.title}".`,
    "petition",
    petition.id,
    petition.tribeId,
    requesterIdentity.characterName,
    requesterIdentity.characterProfileId ?? undefined,
    Array.from(new Set(visibleToCharacterIds))
  );

  return withSponsorshipPayload({
    ...sponsorRequest,
    sponsorRequests: undefined
  });
};

export const setSponsorRequestPreferenceData = async (
  sponsorRequestId: number,
  voterName?: string,
  voterCharacterId?: number | null,
  value?: number
) => {
  if (![1, -1].includes(value ?? 0)) {
    throw new Error("value must be 1 or -1");
  }

  const voterIdentity =
    await resolveCharacterIdentity(
      voterCharacterId,
      voterName
    );

  if (!voterIdentity.characterName) {
    throw new Error("voter identity is required");
  }

  const sponsorRequest =
    await prisma.petitionSponsorRequest.findUnique({
      where: {
        id: sponsorRequestId
      },
      include: {
        petition: true
      }
    });

  if (
    !sponsorRequest ||
    sponsorRequest.requestType !== "request" ||
    sponsorRequest.status !== "pending"
  ) {
    throw new Error("Pending sponsorship request not found");
  }

  if (sponsorRequest.petition.status !== "open") {
    throw new Error(
      "Sponsor approvals are only available for open petitions"
    );
  }

  await requireActiveSponsor(
    sponsorRequest.petitionId,
    voterIdentity.characterName
  );

  await prisma.petitionSponsorRequestPreference.upsert({
    where: {
      sponsorRequestId_voterName: {
        sponsorRequestId,
        voterName: voterIdentity.characterName
      }
    },
    create: {
      sponsorRequestId,
      voterName: voterIdentity.characterName,
      voterCharacterId:
        voterIdentity.characterProfileId,
      value: value as number
    },
    update: {
      voterCharacterId:
        voterIdentity.characterProfileId,
      value: value as number
    }
  });

  const readiness =
    await getSponsorRequestReadiness(sponsorRequestId);

  let finalStatus: string | null = null;

  if (readiness.approval.thresholdMet) {
    finalStatus = "accepted";
  } else if (readiness.decline.thresholdMet) {
    finalStatus = "declined";
  }

  if (finalStatus) {
    await prisma.petitionSponsorRequest.update({
      where: {
        id: sponsorRequestId
      },
      data: {
        status: finalStatus
      }
    });

    if (finalStatus === "accepted") {
      const existingSponsor =
        await prisma.petitionSponsor.findUnique({
          where: {
            petitionId_sponsorName: {
              petitionId:
                sponsorRequest.petitionId,
              sponsorName:
                sponsorRequest.requesterName
            }
          }
        });

      if (existingSponsor) {
        await prisma.petitionSponsor.update({
          where: {
            id: existingSponsor.id
          },
          data: {
            removedAt: null,
            sponsorCharacterId:
              sponsorRequest.requesterCharacterId
          }
        });
      } else {
        await prisma.petitionSponsor.create({
          data: {
            petitionId: sponsorRequest.petitionId,
            sponsorName:
              sponsorRequest.requesterName,
            sponsorCharacterId:
              sponsorRequest.requesterCharacterId
          }
        });
      }
    }

    await createActivityEventData(
      "petition",
      finalStatus === "accepted"
        ? "Sponsorship Request Approved"
        : "Sponsorship Request Declined",
      `Sponsorship request from ${sponsorRequest.requesterName} for "${sponsorRequest.petition.title}" was ${finalStatus}.`,
      "petition",
      sponsorRequest.petitionId,
      sponsorRequest.petition.tribeId,
      voterIdentity.characterName,
      voterIdentity.characterProfileId ?? undefined,
      []
    );
  }

  const updated =
    await prisma.petitionSponsorRequest.findUnique({
      where: {
        id: sponsorRequestId
      },
      include: {
        requesterCharacter: true,
        recipientCharacter: true,
        preferences: true
      }
    });

  if (!updated) {
    throw new Error("Sponsor request not found");
  }

  return {
    ...updated,
    preferences: undefined,
    readiness: finalStatus
      ? await getSponsorRequestReadiness(
          sponsorRequestId
        )
      : readiness
  };
};

export const leavePetitionSponsorshipData = async (
  petitionId: number,
  sponsorName?: string,
  sponsorCharacterId?: number | null
) => {
  const sponsorIdentity =
    await resolveCharacterIdentity(
      sponsorCharacterId,
      sponsorName
    );

  if (!sponsorIdentity.characterName) {
    throw new Error("sponsor identity is required");
  }

  const petition = await prisma.petition.findUnique({
    where: {
      id: petitionId
    }
  });

  if (
    !petition ||
    !["draft", "open"].includes(petition.status)
  ) {
    throw new Error(
      "Sponsors can only leave draft or open petitions"
    );
  }

  const sponsor = await requireActiveSponsor(
    petitionId,
    sponsorIdentity.characterName
  );

  await prisma.petitionSponsor.update({
    where: {
      id: sponsor.id
    },
    data: {
      removedAt: new Date()
    }
  });

  await createActivityEventData(
    "petition",
    "Sponsor Left",
    `${sponsorIdentity.characterName} left sponsorship for "${petition.title}".`,
    "petition",
    petition.id,
    petition.tribeId,
    sponsorIdentity.characterName,
    sponsorIdentity.characterProfileId ?? undefined,
    petition.status === "draft"
      ? await getCharacterIdsForPrivatePetition(
          petition.id
        )
      : []
  );

  await archiveDraftIfSponsorless(petitionId);

  return {
    ok: true
  };
};

export const publishExpiredDraftPetitionsData =
  async () => {
    const expiredDrafts = await prisma.petition.findMany({
      where: {
        type: "project",
        status: "draft",
        publishAt: {
          lte: new Date()
        },
        tribe: {
          deletedAt: null
        }
      }
    });

    let publishedCount = 0;
    let expiredInviteCount = 0;

    for (const petition of expiredDrafts) {
      const expiredInvites =
        await prisma.petitionSponsorRequest.updateMany({
          where: {
            petitionId: petition.id,
            requestType: "invite",
            status: "pending"
          },
          data: {
            status: "expired"
          }
        });

      expiredInviteCount += expiredInvites.count;

      await prisma.petition.update({
        where: {
          id: petition.id
        },
        data: {
          status: "open"
        }
      });

      await createActivityEventData(
        "petition",
        "Petition Published",
        `Project petition "${petition.title}" is now open for tribe support and sponsorship requests.`,
        "petition",
        petition.id,
        petition.tribeId,
        "System",
        undefined,
        []
      );

      publishedCount += 1;
    }

    return {
      publishedCount,
      expiredInviteCount
    };
  };
