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
    if (
      !req.body.projectId ||
      (!req.body.signer && !req.body.signerCharacterId)
    ) {
      return res.status(400).json({
        error:
          "projectId and signer or signerCharacterId are required"
      });
    }

    const petition = await createPetitionData(
      req.body.projectId,
      req.body.signer,
      req.body.signerCharacterId
    );

    res.status(201).json(petition);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to create petition. Verify projectId exists."
    });
  }
};
