import { Request, Response } from "express";

import {
  getAidRequestsData,
  createAidRequestData
} from "../domains/aid/aidService";

export const getAidRequests = async (
  req: Request,
  res: Response
) => {
  const aidRequests = await getAidRequestsData();

  res.json(aidRequests);
};

export const createAidRequest = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !req.body.tribeId ||
      !req.body.requesterName ||
      !req.body.title ||
      !req.body.description ||
      !req.body.resourceType ||
      !req.body.amountRequested ||
      !req.body.supportType
    ) {
      return res.status(400).json({
        error: "Missing required aid request fields"
      });
    }

    const aidRequest = await createAidRequestData(
      req.body.tribeId,
      req.body.requesterName,
      req.body.title,
      req.body.description,
      req.body.resourceType,
      req.body.amountRequested,
      req.body.supportType
    );

    res.status(201).json(aidRequest);
  } catch (error) {
    res.status(400).json({
      error:
        "Unable to create aid request. Verify tribeId exists."
    });
  }
};