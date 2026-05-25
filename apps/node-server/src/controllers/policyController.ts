import { Request, Response } from "express";

import {
  getGovernanceTopicsData,
  createGovernanceTopicData,
  setGovernancePreferenceData,
  getGovernanceTemperatureData
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
      maxLabel
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
        maxLabel
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
      value
    } = req.body;

    if (
      !topicId ||
      !memberName ||
      typeof value !== "number"
    ) {
      return res.status(400).json({
        error:
          "topicId, memberName, and numeric value are required"
      });
    }

    if (value < -2 || value > 2) {
      return res.status(400).json({
        error: "value must be between -2 and 2"
      });
    }

    const preference =
      await setGovernancePreferenceData(
        topicId,
        memberName,
        value
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