import { Request, Response } from "express";

import {
  getSupportRequestsData,
  createSupportRequestData,
  supportSupportRequestData
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
      !req.body.requesterName &&
      !req.body.requesterCharacterId
    ) {
      return res.status(400).json({
        error:
          "requesterName or requesterCharacterId is required"
      });
    }

    if (
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
      req.body.tribeId ?? null,
      req.body.requesterName,
      req.body.title,
      req.body.description,
      req.body.resourceType,
      req.body.amountRequested,
      req.body.supportType,
      req.body.requesterCharacterId,
      req.body.projectId ?? null,
      req.body.requestedFromType,
      req.body.commonsPoolId ?? null
    );

    res.status(201).json(supportRequest);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to create support request. Verify related ids exist."
    });
  }
};

export const supportSupportRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const supportRequestId = Number(
      req.params.supportRequestId
    );

    if (
      !supportRequestId ||
      (!req.body.supporterName &&
        !req.body.supporterCharacterId)
    ) {
      return res.status(400).json({
        error:
          "supportRequestId and supporterName or supporterCharacterId are required"
      });
    }

    const support = await supportSupportRequestData(
      supportRequestId,
      req.body.supporterName,
      req.body.supporterCharacterId
    );

    res.status(201).json(support);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to support approval for support request"
    });
  }
};
