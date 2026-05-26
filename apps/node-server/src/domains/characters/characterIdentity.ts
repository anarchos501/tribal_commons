import { prisma } from "../../lib/prisma";

export const resolveCharacterIdentity = async (
  characterProfileId?: number | null,
  fallbackName?: string
) => {
  if (!characterProfileId) {
    return {
      characterProfileId: undefined,
      characterName: fallbackName
    };
  }

  const character = await prisma.characterProfile.findFirst({
    where: {
      id: characterProfileId,
      deletedAt: null
    }
  });

  if (!character) {
    throw new Error("Character profile not found");
  }

  return {
    characterProfileId: character.id,
    characterName: character.characterName
  };
};
