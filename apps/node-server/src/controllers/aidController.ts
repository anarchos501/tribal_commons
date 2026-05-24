import { Request, Response } from "express";
import { AidRequest } from "../../../packages/shared-types/aidRequest";
import { AidContribution } from "../../../packages/shared-types/aidContribution";

let aidRequests: AidRequest[] = [];
let aidContributions: AidContribution[] = [];

export const getAidRequests = (req: Request, res: Response) => {
  res.json(aidRequests);
};

export const createAidRequest = (req: Request, res: Response) => {

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

  const newAidRequest: AidRequest = {
    id: aidRequests.length + 1,
    tribeId: req.body.tribeId,
    requesterName: req.body.requesterName,
    title: req.body.title,
    description: req.body.description,
    resourceType: req.body.resourceType,
    amountRequested: req.body.amountRequested,
    supportType: req.body.supportType,
    status: "open",
    createdAt: new Date().toISOString()
  };

  aidRequests.push(newAidRequest);

  res.status(201).json(newAidRequest);
};

export const getAidContributions = (req: Request, res: Response) => {
  res.json(aidContributions);
};

export const createAidContribution = (req: Request, res: Response) => {

  if (
    !req.body.aidRequestId ||
    !req.body.contributorName ||
    !req.body.sourceType ||
    !req.body.resourceType ||
    !req.body.amount
  ) {
    return res.status(400).json({
      error: "Missing required contribution fields"
    });
  }

  const newContribution: AidContribution = {
    id: aidContributions.length + 1,
    aidRequestId: req.body.aidRequestId,
    contributorName: req.body.contributorName,
    sourceType: req.body.sourceType,
    resourceType: req.body.resourceType,
    amount: req.body.amount,
    createdAt: new Date().toISOString()
  };

  aidContributions.push(newContribution);

  res.status(201).json(newContribution);
};