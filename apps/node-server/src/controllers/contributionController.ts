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
    if (
      !req.body.projectId ||
      !req.body.playerName ||
      !req.body.resourceType ||
      !req.body.amount
    ) {
      return res.status(400).json({
        error:
          "projectId, playerName, resourceType, and amount are required"
      });
    }

    const contribution = await createContributionData(
      req.body.projectId,
      req.body.playerName,
      req.body.resourceType,
      req.body.amount
    );

    res.status(201).json(contribution);

      } catch (error) {

    res.status(400).json({
      error:
        "Unable to create contribution. Verify projectId exists."
    });
  }
};