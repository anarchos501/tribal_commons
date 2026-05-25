import { prisma } from "../../lib/prisma";

export const getGovernanceTopicsData = async (
  tribeId: number
) => {
  return prisma.governanceTopic.findMany({
    where: {
      tribeId
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
  memberName: string,
  value: number
) => {
  const existing =
    await prisma.governancePreference.findUnique({
      where: {
        topicId_memberName: {
          topicId,
          memberName
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
        value
      }
    });
  }

  return prisma.governancePreference.create({
    data: {
      topicId,
      memberName,
      value
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

  let temperature = "neutral";

  if (averageValue <= -1.25) {
    temperature = "highly restrictive";
  } else if (averageValue < -0.25) {
    temperature = "restrictive";
  } else if (averageValue > 1.25) {
    temperature = "highly open";
  } else if (averageValue > 0.25) {
    temperature = "open";
  }

  return {
    topicId,
    preferenceCount: preferences.length,
    averageValue,
    temperature
  };
};