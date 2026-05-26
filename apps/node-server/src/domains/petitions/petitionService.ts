import { prisma } from "../../lib/prisma";
import { createActivityEventData } from "../../services/activityFeedService";
import { resolveCharacterIdentity } from "../characters/characterIdentity";

export const getPetitionsData = async () => {
  return prisma.petition.findMany({
    include: {
      project: true,
      signerCharacter: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createPetitionData = async (
  projectId: number,
  signer: string | undefined,
  signerCharacterId?: number | null
) => {
  const signerIdentity = await resolveCharacterIdentity(
    signerCharacterId,
    signer
  );

  if (!signerIdentity.characterName) {
    throw new Error(
      "signer or signerCharacterId is required"
    );
  }

  const petition = await prisma.petition.create({
    data: {
      projectId,
      signer: signerIdentity.characterName,
      signerCharacterId:
        signerIdentity.characterProfileId
    },
    include: {
      project: true,
      signerCharacter: true
    }
  });

  await createActivityEventData(
    "petition",
    "Petition Signed",
    `${petition.signer} signed support for ${petition.project.title}.`,
    "project",
    petition.projectId,
    petition.project.tribeId,
    petition.signer,
    petition.signerCharacterId ?? undefined
  );

  return petition;
};
