import { Request, Response } from "express";

import {
  getMembershipsData,
  createMembershipData
} from "../domains/memberships/membershipService";

export const getMemberships = async (
  req: Request,
  res: Response
) => {

  const memberships =
    await getMembershipsData();

  res.json(memberships);
};

export const createMembership = async (
  req: Request,
  res: Response
) => {

  try {

    if (
      !req.body.tribeId ||
      !req.body.role
    ) {
      return res.status(400).json({
        error: "tribeId and role are required"
      });
    }

    const membership =
      await createMembershipData(
        req.body.tribeId,
        req.body.role
      );

    res.status(201).json(membership);

  } catch (error) {

    res.status(400).json({
      error:
        "Unable to create membership. Verify tribeId exists."
    });
  }
};