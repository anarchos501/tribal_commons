import { prisma } from "../../lib/prisma";
import { resolveCharacterIdentity } from "../characters/characterIdentity";
import {
  defaultGovernanceTopics,
  defaultPetitionGovernanceTopics,
  defaultProjectGovernanceTopics,
  getRequiredSignaturePercentage,
  getTemperatureLabel,
  getTemperatureScore,
  getThresholdBand
} from "./governanceTemperature";

const preferenceCooldownHours = 1;

export const seedDefaultGovernanceTopicsForTribe =
  async (tribeId: number) => {
    const createdTopics = [];

    for (const topic of defaultGovernanceTopics) {
      const existing =
        await prisma.governanceTopic.findFirst({
          where: {
            tribeId,
            scope: "tribe",
            key: topic.key
          }
        });

      if (existing) {
        continue;
      }

      const created =
        await prisma.governanceTopic.create({
          data: {
            tribeId,
            scope: "tribe",
            key: topic.key,
            title: topic.title,
            description: topic.description,
            minLabel: "Restrictive",
            maxLabel: "Open"
          }
        });

      createdTopics.push(created);
    }

    return createdTopics;
  };

export const seedDefaultGovernanceTopicsForProject =
  async (projectId: number) => {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        tribe: {
          deletedAt: null
        }
      }
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const createdTopics = [];

    for (const topic of defaultProjectGovernanceTopics) {
      const existing =
        await prisma.governanceTopic.findFirst({
          where: {
            tribeId: project.tribeId,
            projectId: project.id,
            scope: "project",
            key: topic.key
          }
        });

      if (existing) {
        continue;
      }

      const created =
        await prisma.governanceTopic.create({
          data: {
            tribeId: project.tribeId,
            projectId: project.id,
            scope: "project",
            key: topic.key,
            title: topic.title,
            description: topic.description,
            minLabel: "Restrictive",
            maxLabel: "Open"
          }
        });

      createdTopics.push(created);
    }

    return createdTopics;
  };

export const seedDefaultGovernanceTopicsForPetition =
  async (petitionId: number) => {
    const petition = await prisma.petition.findFirst({
      where: {
        id: petitionId,
        type: "project",
        tribe: {
          deletedAt: null
        }
      }
    });

    if (!petition) {
      throw new Error("Project petition not found");
    }

    const createdTopics = [];

    for (const topic of defaultPetitionGovernanceTopics) {
      const existing =
        await prisma.governanceTopic.findFirst({
          where: {
            tribeId: petition.tribeId,
            petitionId: petition.id,
            scope: "petition",
            key: topic.key
          }
        });

      if (existing) {
        continue;
      }

      const created =
        await prisma.governanceTopic.create({
          data: {
            tribeId: petition.tribeId,
            petitionId: petition.id,
            scope: "petition",
            key: topic.key,
            title: topic.title,
            description: topic.description,
            minLabel: "Restrictive",
            maxLabel: "Open"
          }
        });

      createdTopics.push(created);
    }

    return createdTopics;
  };

export const backfillDefaultGovernanceTopicsData =
  async () => {
    const tribes = await prisma.tribe.findMany({
      where: {
        deletedAt: null
      }
    });

    let createdTopicCount = 0;
    let createdProjectTopicCount = 0;
    let createdPetitionTopicCount = 0;

    for (const tribe of tribes) {
      const created =
        await seedDefaultGovernanceTopicsForTribe(
          tribe.id
        );

      createdTopicCount += created.length;
    }

    const projects = await prisma.project.findMany({
      where: {
        tribe: {
          deletedAt: null
        }
      }
    });

    for (const project of projects) {
      const created =
        await seedDefaultGovernanceTopicsForProject(
          project.id
        );

      createdProjectTopicCount += created.length;
    }

    const projectPetitions = await prisma.petition.findMany({
      where: {
        type: "project",
        tribe: {
          deletedAt: null
        }
      }
    });

    for (const petition of projectPetitions) {
      const created =
        await seedDefaultGovernanceTopicsForPetition(
          petition.id
        );

      createdPetitionTopicCount += created.length;
    }

    return {
      tribeCount: tribes.length,
      projectCount: projects.length,
      projectPetitionCount: projectPetitions.length,
      createdTopicCount,
      createdProjectTopicCount,
      createdPetitionTopicCount
    };
  };

export const getGovernanceTopicsData = async (
  tribeId: number
) => {
  await seedDefaultGovernanceTopicsForTribe(tribeId);

  return prisma.governanceTopic.findMany({
    where: {
      tribeId,
      scope: "tribe",
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
  maxLabel: string,
  scope = "tribe",
  projectId?: number | null
) => {
  return prisma.governanceTopic.create({
    data: {
      tribeId,
      scope,
      projectId,
      key,
      title,
      description,
      minLabel,
      maxLabel
    }
  });
};

export const getProjectGovernanceTopicsData = async (
  projectId: number
) => {
  await seedDefaultGovernanceTopicsForProject(projectId);

  return prisma.governanceTopic.findMany({
    where: {
      projectId,
      scope: "project",
      project: {
        tribe: {
          deletedAt: null
        }
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

export const setGovernancePreferenceData = async (
  topicId: number,
  memberName: string | undefined,
  value: number,
  memberCharacterId?: number | null
) => {
  if (![-1, 0, 1].includes(value)) {
    throw new Error("value must be -1, 0, or 1");
  }

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

    if (hoursSinceUpdate < preferenceCooldownHours) {
      throw new Error(
        "Preference can only be changed once every hour"
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

  const total =
    preferences.reduce(
      (sum, preference) => sum + preference.value,
      0
    );

  const averageValue =
    preferences.length === 0
      ? 0
      : total / preferences.length;

  const temperatureScore =
    getTemperatureScore(averageValue);

  const temperatureLabel =
    getTemperatureLabel(temperatureScore);

  return {
    topicId,
    preferenceCount: preferences.length,
    averageValue,
    temperatureScore,
    temperatureLabel,
    thresholdBand: getThresholdBand(temperatureScore),
    requiredSignaturePercentage:
      getRequiredSignaturePercentage(temperatureScore)
  };
};

export const getGovernanceTemperatureForTopicKeyData =
  async (
    tribeId: number,
    key: string,
    scope = "tribe",
    projectId?: number | null,
    petitionId?: number | null
  ) => {
    if (scope === "project" && projectId) {
      await seedDefaultGovernanceTopicsForProject(
        projectId
      );
    } else if (scope === "petition" && petitionId) {
      await seedDefaultGovernanceTopicsForPetition(
        petitionId
      );
    } else {
      await seedDefaultGovernanceTopicsForTribe(tribeId);
    }

    const topic = await prisma.governanceTopic.findFirst({
      where: {
        tribeId,
        key,
        scope,
        ...(projectId
          ? {
              projectId
            }
          : {}),
        ...(petitionId
          ? {
              petitionId
            }
          : {})
      }
    });

    if (!topic) {
      throw new Error("Governance topic not found");
    }

    return getGovernanceTemperatureData(topic.id);
  };

export {
  getRequiredSignaturePercentage,
  getThresholdBand
};
