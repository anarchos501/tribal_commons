import { Request, Response } from "express";

import {
  getTribesData,
  createTribeData
} from "../domains/tribes/tribeService";

export const getTribesPage = async (
  req: Request,
  res: Response
) => {
  const tribes = await getTribesData();

  res.json(tribes);
};

export const createTribe = async (
  req: Request,
  res: Response
) => {
  if (
    !req.body.name ||
    req.body.name.trim() === "" ||
    !req.body.locality
  ) {
    return res.status(400).json({
      error: "name and locality are required"
    });
  }

  const newTribe = await createTribeData(
    req.body.name,
    req.body.locality
  );

  res.status(201).json(newTribe);
};