import { Request, Response } from "express";

import {
  getGovernanceTopicsData,
  createGovernanceTopicData,
  setGovernancePreferenceData,
  getGovernanceTemperatureData,
  backfillDefaultGovernanceTopicsData,
  getProjectGovernanceTopicsData
} from "../domains/policies/policyService";

export const getGovernanceTopics = async (
  req: Request,
  res: Response
) => {
  const tribeId = Number(req.params.tribeId);

  const topics =
    await getGovernanceTopicsData(tribeId);

  res.json(topics);
};

export const createGovernanceTopic = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      tribeId,
      key,
      title,
      description,
      minLabel,
      maxLabel,
      scope,
      projectId
    } = req.body;

    if (
      !tribeId ||
      !key ||
      !title ||
      !description ||
      !minLabel ||
      !maxLabel
    ) {
      return res.status(400).json({
        error: "All topic fields are required"
      });
    }

    const topic =
      await createGovernanceTopicData(
        tribeId,
        key,
        title,
        description,
        minLabel,
        maxLabel,
        scope,
        projectId
      );

    res.status(201).json(topic);
  } catch (error) {
    res.status(400).json({
      error: "Unable to create governance topic"
    });
  }
};

export const setGovernancePreference = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      topicId,
      memberName,
      value,
      memberCharacterId
    } = req.body;

    if (
      !topicId ||
      (!memberName && !memberCharacterId) ||
      typeof value !== "number"
    ) {
      return res.status(400).json({
        error:
          "topicId, memberName or memberCharacterId, and numeric value are required"
      });
    }

    if (![-1, 0, 1].includes(value)) {
      return res.status(400).json({
        error: "value must be -1, 0, or 1"
      });
    }

    const preference =
      await setGovernancePreferenceData(
        topicId,
        memberName,
        value,
        memberCharacterId
      );

    res.status(201).json(preference);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to set governance preference"
    });
  }
};

export const getGovernanceTemperature = async (
  req: Request,
  res: Response
) => {
  const topicId = Number(req.params.topicId);

  const temperature =
    await getGovernanceTemperatureData(topicId);

  res.json(temperature);
};

export const getProjectGovernanceTopics = async (
  req: Request,
  res: Response
) => {
  const projectId = Number(req.params.projectId);

  const topics =
    await getProjectGovernanceTopicsData(projectId);

  res.json(topics);
};

export const backfillDefaultGovernanceTopics =
  async (req: Request, res: Response) => {
    try {
      const result =
        await backfillDefaultGovernanceTopicsData();

      res.json(result);
    } catch (error) {
      res.status(400).json({
        error:
          "Unable to backfill default governance topics"
      });
    }
  };
