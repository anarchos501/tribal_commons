import { prisma } from "../../lib/prisma";
import { createActivityEventData } from "../../services/activityFeedService";

export const getPetitionsData = async () => {
  return prisma.petition.findMany({
    include: {
      project: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createPetitionData = async (
  projectId: number,
  signer: string
) => {
  const petition = await prisma.petition.create({
    data: {
      projectId,
      signer
    },
    include: {
      project: true
    }
  });

  await createActivityEventData(
    "petition",
    "Petition Signed",
    `${signer} signed support for ${petition.project.title}.`,
    "project",
    petition.projectId,
    petition.project.tribeId,
    signer
  );

  return petition;
};