import { Request, Response } from "express";

import {
  getSupportRequestsData,
  createSupportRequestData
} from "../domains/support/supportService";

export const getSupportRequests = async (
  req: Request,
  res: Response
) => {
  const supportRequests = await getSupportRequestsData();

  res.json(supportRequests);
};

export const createSupportRequest = async (
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
        error: "Missing required support request fields"
      });
    }

    const supportRequest = await createSupportRequestData(
      req.body.tribeId,
      req.body.requesterName,
      req.body.title,
      req.body.description,
      req.body.resourceType,
      req.body.amountRequested,
      req.body.supportType
    );

    res.status(201).json(supportRequest);
  } catch (error) {
    res.status(400).json({
      error:
        "Unable to create support request. Verify tribeId exists."
    });
  }
};