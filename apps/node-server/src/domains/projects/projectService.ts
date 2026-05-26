import { prisma } from "../../lib/prisma";
import { createActivityEventData } from "../../services/activityFeedService";
import { seedDefaultGovernanceTopicsForProject } from "../policies/policyService";

export const getProjectsData = async () => {
  return prisma.project.findMany({
    where: {
      tribe: {
        deletedAt: null
      }
    },
    include: {
      petitions: {
        include: {
          supports: true,
          proposerCharacter: true
        }
      },
      contributions: true,
      memberships: {
        where: {
          removedAt: null
        },
        include: {
          characterProfile: true
        }
      },
      actions: {
        include: {
          proposerCharacter: true,
          supports: {
            include: {
              supporterCharacter: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      governanceTopics: {
        where: {
          scope: "project"
        },
        include: {
          preferences: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createProjectData = async (
  tribeId: number,
  title: string
) => {
  const project = await prisma.project.create({
    data: {
      tribeId,
      title,
      status: "proposal"
    }
  });

  await createActivityEventData(
    "project",
    "Project Created",
    `${title} was created as a new project proposal.`,
    "project",
    project.id,
    tribeId,
    "System"
  );

  await seedDefaultGovernanceTopicsForProject(project.id);

  return project;
};

export const updateProjectStatusData = async (
  projectId: number,
  status: string
) => {
  const lifecycleData: any = {
    status
  };

  if (status === "staging") {
    lifecycleData.startedAt = new Date();
  }

  if (status === "completed") {
    lifecycleData.completedAt = new Date();
  }

  if (status === "failed") {
    lifecycleData.failedAt = new Date();
  }

  if (status === "archived") {
    lifecycleData.archivedAt = new Date();
  }

  const project = await prisma.project.update({
    where: {
      id: projectId
    },
    data: lifecycleData
  });

  await createActivityEventData(
    "project",
    "Project Status Updated",
    `${project.title} moved to ${status}.`,
    "project",
    project.id,
    project.tribeId,
    "System"
  );

  return project;
};
