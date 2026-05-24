import { Request, Response } from "express";
import { CommonsAllocation } from "../../../packages/shared-types/commonsAllocation";

let allocations: CommonsAllocation[] = [];

export const getAllocations = (req: Request, res: Response) => {
  res.json(allocations);
};

export const createAllocation = (req: Request, res: Response) => {

  if (
    !req.body.commonsPoolId ||
    !req.body.projectId ||
    !req.body.resourceType ||
    !req.body.amount ||
    !req.body.reason
  ) {
    return res.status(400).json({
      error: "commonsPoolId, projectId, resourceType, amount, and reason are required"
    });
  }

  const newAllocation: CommonsAllocation = {
    id: allocations.length + 1,
    commonsPoolId: req.body.commonsPoolId,
    projectId: req.body.projectId,
    resourceType: req.body.resourceType,
    amount: req.body.amount,
    reason: req.body.reason,
    createdAt: new Date().toISOString()
  };

  allocations.push(newAllocation);

  res.status(201).json(newAllocation);
};