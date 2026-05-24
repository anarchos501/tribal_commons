import { prisma } from "../../lib/prisma";

export const getProjectsData = async () => {
  return prisma.project.findMany({
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