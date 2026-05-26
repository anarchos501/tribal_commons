import { Request, Response } from "express";
import type { Tribe } from "../../../../packages/shared-types/tribe";

let tribes: Tribe[] = [];

export const getTribes = (req: Request, res: Response) => {
  res.json(tribes);
};

export const createTribe = (req: Request, res: Response) => {

  if (
    !req.body.name ||
    !req.body.description ||
    !req.body.locality
  ) {
    return res.status(400).json({
      error: "name, description, and locality are required"
    });
  }

  const newTribe: Tribe = {
    id: tribes.length + 1,
    name: req.body.name,
    description: req.body.description,
    locality: req.body.locality,
    createdAt: new Date().toISOString()
  };

  tribes.push(newTribe);

  res.status(201).json(newTribe);
};
