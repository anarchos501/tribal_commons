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

  const observerCharacterId = req.query.observerCharacterId
    ? Number(req.query.observerCharacterId)
    : undefined;

  const standings =
    await getPersonalStandingsData(
      observerName,
      observerCharacterId
    );

  res.json(standings);
};

export const createPersonalStanding = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      (!req.body.observerName &&
        !req.body.observerCharacterId) ||
      !req.body.subjectType ||
      (!req.body.subjectName &&
        !req.body.subjectCharacterId) ||
      typeof req.body.value !== "number"
    ) {
      return res.status(400).json({
        error:
          "observer, subjectType, subject, and numeric value are required"
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
        req.body.tribeContextId,
        req.body.observerCharacterId,
        req.body.subjectCharacterId
      );

    res.status(201).json(standing);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to create personal standing"
    });
  }
};
