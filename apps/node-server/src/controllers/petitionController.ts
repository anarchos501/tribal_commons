import { Request, Response } from "express";

import {
  getPetitionsData,
  createPetitionData,
  supportPetitionData
} from "../domains/petitions/petitionService";

export const getPetitions = async (
  req: Request,
  res: Response
) => {
  const tribeId =
    typeof req.query.tribeId === "string"
      ? Number(req.query.tribeId)
      : undefined;

  const type =
    typeof req.query.type === "string"
      ? req.query.type
      : undefined;

  const status =
    typeof req.query.status === "string"
      ? req.query.status
      : undefined;

  const petitions = await getPetitionsData(
    tribeId,
    type,
    status
  );

  res.json(petitions);
};

export const createPetition = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !req.body.type ||
      !req.body.title ||
      !req.body.description ||
      !req.body.tribeId ||
      (!req.body.proposerName &&
        !req.body.proposerCharacterId)
    ) {
      return res.status(400).json({
        error:
          "type, title, description, tribeId, and proposer are required"
      });
    }

    const petition = await createPetitionData({
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      tribeId: req.body.tribeId,
      proposerName: req.body.proposerName,
      proposerCharacterId: req.body.proposerCharacterId,
      sponsorNames: Array.isArray(req.body.sponsorNames)
        ? req.body.sponsorNames
        : undefined,
      sponsorCharacterIds: Array.isArray(
        req.body.sponsorCharacterIds
      )
        ? req.body.sponsorCharacterIds
        : undefined,
      projectId: req.body.projectId ?? null,
      targetTribeId: req.body.targetTribeId ?? null,
      metadata: req.body.metadata
    });

    res.status(201).json(petition);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to create petition"
    });
  }
};

export const supportPetition = async (
  req: Request,
  res: Response
) => {
  try {
    const petitionId = Number(req.params.petitionId);

    if (
      !petitionId ||
      (!req.body.supporterName &&
        !req.body.supporterCharacterId)
    ) {
      return res.status(400).json({
        error:
          "petitionId and supporterName or supporterCharacterId are required"
      });
    }

    const support = await supportPetitionData(
      petitionId,
      req.body.supporterName,
      req.body.supporterCharacterId
    );

    res.status(201).json(support);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to support petition"
    });
  }
};
