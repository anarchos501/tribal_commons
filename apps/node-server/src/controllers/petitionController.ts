import { Request, Response } from "express";
import { Petition } from "../../../packages/shared-types/petition";

let petitions: Petition[] = [];

export const getPetitions = (req: Request, res: Response) => {
  res.json(petitions);
};

export const createPetition = (req: Request, res: Response) => {

  if (!req.body.projectId || !req.body.signer) {
    return res.status(400).json({
      error: "projectId and signer are required"
    });
  }

  const newPetition: Petition = {
    id: petitions.length + 1,
    projectId: req.body.projectId,
    signer: req.body.signer,
    createdAt: new Date().toISOString()
  };

  petitions.push(newPetition);

  res.status(201).json(newPetition);
};