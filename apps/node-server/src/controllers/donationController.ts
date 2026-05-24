import { Request, Response } from "express";
import { Donation } from "../../../packages/shared-types/donation";

let donations: Donation[] = [];

export const getDonations = (req: Request, res: Response) => {
  res.json(donations);
};

export const createDonation = (req: Request, res: Response) => {

  if (
    !req.body.projectId ||
    !req.body.playerName ||
    !req.body.resourceType ||
    !req.body.amount
  ) {
    return res.status(400).json({
      error: "projectId, playerName, resourceType, and amount are required"
    });
  }

  const newDonation: Donation = {
    id: donations.length + 1,
    projectId: req.body.projectId,
    playerName: req.body.playerName,
    resourceType: req.body.resourceType,
    amount: req.body.amount,
    createdAt: new Date().toISOString()
  };

  donations.push(newDonation);

  res.status(201).json(newDonation);
};