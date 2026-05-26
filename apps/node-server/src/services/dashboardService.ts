import { prisma } from "../lib/prisma";

export const getDashboardData = async (
  playerName: string
) => {
  const memberships =
    await prisma.membership.findMany({
      include: {
        tribe: true
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
    player: playerName,
    memberships,
    myProjects: projects,
    openSupportRequests: supportRequests
  };
};