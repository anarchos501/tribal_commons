import { Request, Response } from "express";
import { CommonsPool } from "../../../packages/shared-types/commonsPool";

let commonsPools: CommonsPool[] = [];

export const getCommonsPools = (req: Request, res: Response) => {
  res.json(commonsPools);
};

export const createCommonsPool = (req: Request, res: Response) => {

  if (
    !req.body.tribeId ||
    !req.body.name ||
    !req.body.description
  ) {
    return res.status(400).json({
      error: "tribeId, name, and description are required"
    });
  }

  const newCommonsPool: CommonsPool = {
    id: commonsPools.length + 1,
    tribeId: req.body.tribeId,
    name: req.body.name,
    description: req.body.description,
    resources: [],
    createdAt: new Date().toISOString()
  };

  commonsPools.push(newCommonsPool);

  res.status(201).json(newCommonsPool);
};