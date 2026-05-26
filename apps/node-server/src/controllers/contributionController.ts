import { Request, Response } from "express";

import {
  getContributionsData,
  createContributionData
} from "../domains/contributions/contributionService";

export const getContributions = async (
  req: Request,
  res: Response
) => {
  const contributions = await getContributionsData();

  res.json(contributions);
};

export const createContribution = async (
  req: Request,
  res: Response
) => {
  try {
    const targetCount = [
      req.body.projectId,
      req.body.supportRequestId,
      req.body.commonsPoolId
    ].filter((targetId) => targetId != null).length;

    if (
      targetCount !== 1
    ) {
      return res.status(400).json({
        error:
          "Exactly one of projectId, supportRequestId, or commonsPoolId is required"
      });
    }

    if (
      !req.body.contributorName &&
      !req.body.contributorCharacterId
    ) {
      return res.status(400).json({
        error:
          "contributorName or contributorCharacterId is required"
      });
    }

    if (
      !req.body.resourceType ||
      typeof req.body.amount !== "number"
    ) {
      return res.status(400).json({
        error:
          "resourceType and numeric amount are required"
      });
    }

    const contribution = await createContributionData(
      req.body.projectId ?? null,
      req.body.contributorName,
      req.body.resourceType,
      req.body.amount,
      req.body.supportRequestId ?? null,
      req.body.commonsPoolId ?? null,
      req.body.contributorCharacterId
    );

    res.status(201).json(contribution);

      } catch (error) {

    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to create contribution. Verify related ids exist."
    });
  }
};
