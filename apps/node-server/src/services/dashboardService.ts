import { prisma } from "../lib/prisma";

export const getDashboardData = async (
  characterName?: string,
  characterProfileId?: number
) => {
  const characterProfile =
    characterProfileId || characterName
      ? await prisma.characterProfile.findFirst({
          where: {
            deletedAt: null,
            ...(characterProfileId
              ? {
                  id: characterProfileId
                }
              : {
                  characterName
                })
          }
        })
      : null;

  const activeCharacterId = characterProfile?.id;

  const memberships =
    await prisma.membership.findMany({
      where: {
        tribe: {
          deletedAt: null
        },
        ...(activeCharacterId
          ? {
              characterProfileId: activeCharacterId
            }
          : {}),
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
      },
      include: {
        tribe: true,
        characterProfile: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

  const projects =
    await prisma.project.findMany({
      where: {
        tribe: {
          deletedAt: null,
          ...(activeCharacterId
            ? {
                memberships: {
                  some: {
                    characterProfileId:
                      activeCharacterId
                  }
                }
              }
            : {})
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    });

  const supportRequests =
    await prisma.supportRequest.findMany({
      where: {
        status: "open",
        OR: activeCharacterId
          ? [
              {
                requesterCharacterId:
                  activeCharacterId
              },
              {
                tribe: {
                  deletedAt: null,
                  memberships: {
                    some: {
                      characterProfileId:
                        activeCharacterId
                    }
                  }
                }
              },
              {
                tribeId: null
              }
            ]
          : [
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
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    });

  return {
    character:
      characterProfile?.characterName ??
      characterName ??
      null,
    characterProfile,
    memberships,
    myProjects: projects,
    openSupportRequests: supportRequests
  };
};
