import { prisma } from "../../lib/prisma";
import { createActivityEventData } from "../../services/activityFeedService";

export const getProjectsData = async () => {
  return prisma.project.findMany({
    where: {
      tribe: {
        deletedAt: null
      }
    },
    include: {
      petitions: true,
      contributions: true
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
