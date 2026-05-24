import { Request, Response } from "express";
import { Membership } from "../../../packages/shared-types/membership";

let memberships: Membership[] = [];

export const getMemberships = (req: Request, res: Response) => {
  res.json(memberships);
};

export const createMembership = (req: Request, res: Response) => {

  if (!req.body.tribeId || !req.body.playerName) {
    return res.status(400).json({
      error: "tribeId and playerName are required"
    });
  }

  const newMembership: Membership = {
    id: memberships.length + 1,
    tribeId: req.body.tribeId,
    playerName: req.body.playerName,
    joinedAt: new Date().toISOString()
  };

  memberships.push(newMembership);

  res.status(201).json(newMembership);
};