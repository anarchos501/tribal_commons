import { Request, Response } from "express";

import {
  getDonationsData,
  createDonationData
} from "../domains/donations/donationService";

export const getDonations = async (
  req: Request,
  res: Response
) => {
  const donations = await getDonationsData();

  res.json(donations);
};

export const createDonation = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !req.body.projectId ||
      !req.body.playerName ||
      !req.body.resourceType ||
      !req.body.amount
    ) {
      return res.status(400).json({
        error:
          "projectId, playerName, resourceType, and amount are required"
      });
    }

    const donation = await createDonationData(
      req.body.projectId,
      req.body.playerName,
      req.body.resourceType,
      req.body.amount
    );

    res.status(201).json(donation);

      } catch (error) {

    res.status(400).json({
      error:
        "Unable to create donation. Verify projectId exists."
    });
  }
};