import { Request, Response } from "express";

import {
  getPersonalStandingsData,
  createPersonalStandingData
} from "../domains/standings/standingService";

export const getPersonalStandings = async (
  req: Request,
  res: Response
) => {
  const observerNameParam = req.params.observerName;

  const observerName = Array.isArray(observerNameParam)
    ? observerNameParam[0]
    : observerNameParam;

  const standings =
    await getPersonalStandingsData(observerName);

  res.json(standings);
};

export const createPersonalStanding = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !req.body.observerName ||
      !req.body.subjectType ||
      !req.body.subjectName ||
      typeof req.body.value !== "number"
    ) {
      return res.status(400).json({
        error:
          "observerName, subjectType, subjectName, and numeric value are required"
      });
    }

    if (req.body.value < -1 || req.body.value > 1) {
      return res.status(400).json({
        error: "value must be between -1 and 1"
      });
    }

    const standing =
      await createPersonalStandingData(
        req.body.observerName,
        req.body.subjectType,
        req.body.subjectName,
        req.body.value,
        req.body.note,
        req.body.tribeContextId
      );

    res.status(201).json(standing);
  } catch (error) {
    res.status(400).json({
      error: "Unable to create personal standing"
    });
  }
};