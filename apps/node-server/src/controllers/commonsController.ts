import { Request, Response } from "express";

import {
  getCommonsPoolsData,
  createCommonsPoolData
} from "../domains/commons/commonsService";

export const getCommonsPools = async (
  req: Request,
  res: Response
) => {
  const commonsPools = await getCommonsPoolsData();

  res.json(commonsPools);
};

export const createCommonsPool = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !req.body.tribeId ||
      !req.body.name ||
      !req.body.description
    ) {
      return res.status(400).json({
        error: "tribeId, name, and description are required"
      });
    }

    const commonsPool = await createCommonsPoolData(
      req.body.tribeId,
      req.body.name,
      req.body.description
    );

    res.status(201).json(commonsPool);
  } catch (error) {
    res.status(400).json({
      error:
        "Unable to create commons pool. Verify tribeId exists."
    });
  }
};