import { Request, Response } from "express";

import {
  getTribesData,
  createTribeData
} from "../domains/tribes/tribeService";

export const getTribesPage = (
  req: Request,
  res: Response
) => {

  res.json(getTribesData());
};

export const createTribe = (
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

  const newTribe = createTribeData(
    req.body.name,
    req.body.locality
  );

  res.status(201).json(newTribe);
};