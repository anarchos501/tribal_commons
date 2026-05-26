import { prisma } from "../lib/prisma";

export const getDashboardData = async (
  characterName: string
) => {
  const memberships =
    await prisma.membership.findMany({
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
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    });

  const supportRequests =
    await prisma.supportRequest.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    });

  return {
    character: characterName,
    memberships,
    myProjects: projects,
    openSupportRequests: supportRequests
  };
};