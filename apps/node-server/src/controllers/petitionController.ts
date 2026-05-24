import { Request, Response } from "express";

import {
  getPetitionsData,
  createPetitionData
} from "../domains/petitions/petitionService";

export const getPetitions = async (
  req: Request,
  res: Response
) => {
  const petitions = await getPetitionsData();

  res.json(petitions);
};

export const createPetition = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.body.projectId || !req.body.signer) {
      return res.status(400).json({
        error: "projectId and signer are required"
      });
    }

    const petition = await createPetitionData(
      req.body.projectId,
      req.body.signer
    );

    res.status(201).json(petition);
  } catch (error) {
    res.status(400).json({
      error:
        "Unable to create petition. Verify projectId exists."
    });
  }
};