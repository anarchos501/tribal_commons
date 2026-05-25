import { Request, Response } from "express";

import {
  getFederationRelationshipsData,
  createFederationRelationshipData
} from "../domains/federation/federationService";

export const getFederationRelationships = async (
  req: Request,
  res: Response
) => {
  const sourceTribeId = Number(req.params.sourceTribeId);

  const relationships =
    await getFederationRelationshipsData(sourceTribeId);

  res.json(relationships);
};

export const createFederationRelationship = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      sourceTribeId,
      targetTribeId,
      relationshipType,
      note
    } = req.body;

    if (
      !sourceTribeId ||
      !targetTribeId ||
      !relationshipType
    ) {
      return res.status(400).json({
        error:
          "sourceTribeId, targetTribeId, and relationshipType are required"
      });
    }

    const relationship =
      await createFederationRelationshipData(
        sourceTribeId,
        targetTribeId,
        relationshipType,
        note
      );

    res.status(201).json(relationship);
  } catch (error) {
    res.status(400).json({
      error: "Unable to create federation relationship"
    });
  }
};