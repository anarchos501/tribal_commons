import { prisma } from "../../lib/prisma";
import { resolveCharacterIdentity } from "../characters/characterIdentity";

export const getGovernanceTopicsData = async (
  tribeId: number
) => {
  return prisma.governanceTopic.findMany({
    where: {
      tribeId,
      tribe: {
        deletedAt: null
      }
    },
    include: {
      preferences: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createGovernanceTopicData = async (
  tribeId: number,
  key: string,
  title: string,
  description: string,
  minLabel: string,
  maxLabel: string
) => {
  return prisma.governanceTopic.create({
    data: {
      tribeId,
      key,
      title,
      description,
      minLabel,
      maxLabel
    }
  });
};

export const setGovernancePreferenceData = async (
  topicId: number,
  memberName: string | undefined,
  value: number,
  memberCharacterId?: number | null
) => {
  const memberIdentity =
    await resolveCharacterIdentity(
      memberCharacterId,
      memberName
    );

  if (!memberIdentity.characterName) {
    throw new Error(
      "memberName or memberCharacterId is required"
    );
  }

  const existing =
    await prisma.governancePreference.findUnique({
      where: {
        topicId_memberName: {
          topicId,
          memberName: memberIdentity.characterName
        }
      }
    });

  if (existing) {
    const now = new Date().getTime();
    const updated = new Date(existing.updatedAt).getTime();

    const hoursSinceUpdate =
      (now - updated) / (1000 * 60 * 60);

    if (hoursSinceUpdate < 24) {
      throw new Error(
        "Preference can only be changed once every 24 hours"
      );
    }

    return prisma.governancePreference.update({
      where: {
        id: existing.id
      },
      data: {
        value,
        memberCharacterId:
          memberIdentity.characterProfileId
      }
    });
  }

  return prisma.governancePreference.create({
    data: {
      topicId,
      memberName: memberIdentity.characterName,
      value,
      memberCharacterId:
        memberIdentity.characterProfileId
    }
  });
};

export const getGovernanceTemperatureData = async (
  topicId: number
) => {
  const preferences =
    await prisma.governancePreference.findMany({
      where: {
        topicId
      }
    });

  if (preferences.length === 0) {
    return {
      topicId,
      preferenceCount: 0,
      averageValue: 0,
      temperature: "neutral"
    };
  }

  const total =
    preferences.reduce(
      (sum, preference) => sum + preference.value,
      0
    );

  const averageValue =
    total / preferences.length;

  let temperature = "Neutral";

if (averageValue <= -0.33) {
  temperature = "Restrictive";
}

if (averageValue >= 0.33) {
  temperature = "Open";
}

  return {
    topicId,
    preferenceCount: preferences.length,
    averageValue,
    temperature
  };
};
