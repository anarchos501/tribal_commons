import { prisma } from "../../lib/prisma";

export const getProjectsData = async () => {
  return prisma.project.findMany({
    include: {
      petitions: true,
      donations: true
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
  return prisma.project.create({
    data: {
      tribeId,
      title,
      status: "proposal"
    }
  });
};

export const updateProjectStatusData = async (
  projectId: number,
  status: string
) => {
  const lifecycleData: any = {
    status
  };

  if (status === "active") {
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

  return prisma.project.update({
    where: {
      id: projectId
    },
    data: lifecycleData
  });
};