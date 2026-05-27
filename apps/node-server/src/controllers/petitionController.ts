import { Request, Response } from "express";

import {
  getPetitionsData,
  createPetitionData,
  supportPetitionData,
  invitePetitionSponsorData,
  respondToSponsorInviteData,
  requestPetitionSponsorshipData,
  setSponsorRequestPreferenceData,
  leavePetitionSponsorshipData
} from "../domains/petitions/petitionService";

export const getPetitions = async (
  req: Request,
  res: Response
) => {
  const tribeId =
    typeof req.query.tribeId === "string"
      ? Number(req.query.tribeId)
      : undefined;

  const type =
    typeof req.query.type === "string"
      ? req.query.type
      : undefined;

  const status =
    typeof req.query.status === "string"
      ? req.query.status
      : undefined;

  const currentCharacterId =
    typeof req.query.currentCharacterId === "string"
      ? Number(req.query.currentCharacterId)
      : undefined;

  const petitions = await getPetitionsData(
    tribeId,
    type,
    status,
    currentCharacterId
  );

  res.json(petitions);
};

export const createPetition = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !req.body.type ||
      !req.body.title ||
      !req.body.description ||
      !req.body.tribeId ||
      (!req.body.proposerName &&
        !req.body.proposerCharacterId)
    ) {
      return res.status(400).json({
        error:
          "type, title, description, tribeId, and proposer are required"
      });
    }

    const petition = await createPetitionData({
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      tribeId: req.body.tribeId,
      proposerName: req.body.proposerName,
      proposerCharacterId: req.body.proposerCharacterId,
      sponsorNames: Array.isArray(req.body.sponsorNames)
        ? req.body.sponsorNames
        : undefined,
      sponsorCharacterIds: Array.isArray(
        req.body.sponsorCharacterIds
      )
        ? req.body.sponsorCharacterIds
        : undefined,
      projectId: req.body.projectId ?? null,
      targetTribeId: req.body.targetTribeId ?? null,
      publishDuration: req.body.publishDuration,
      metadata: req.body.metadata
    });

    res.status(201).json(petition);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to create petition"
    });
  }
};

export const invitePetitionSponsor = async (
  req: Request,
  res: Response
) => {
  try {
    const petitionId = Number(req.params.petitionId);

    const invite = await invitePetitionSponsorData(
      petitionId,
      req.body.inviterName,
      req.body.inviterCharacterId,
      req.body.recipientName,
      req.body.recipientCharacterId
    );

    res.status(201).json(invite);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to invite sponsor"
    });
  }
};

export const respondToSponsorInvite = async (
  req: Request,
  res: Response
) => {
  try {
    const sponsorRequestId = Number(
      req.params.sponsorRequestId
    );

    const response = await respondToSponsorInviteData(
      sponsorRequestId,
      req.body.responderName,
      req.body.responderCharacterId,
      req.body.response
    );

    res.json(response);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to respond to sponsor invite"
    });
  }
};

export const requestPetitionSponsorship = async (
  req: Request,
  res: Response
) => {
  try {
    const petitionId = Number(req.params.petitionId);

    const sponsorRequest =
      await requestPetitionSponsorshipData(
        petitionId,
        req.body.requesterName,
        req.body.requesterCharacterId
      );

    res.status(201).json(sponsorRequest);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to request sponsorship"
    });
  }
};

export const setSponsorRequestPreference = async (
  req: Request,
  res: Response
) => {
  try {
    const sponsorRequestId = Number(
      req.params.sponsorRequestId
    );

    const preference =
      await setSponsorRequestPreferenceData(
        sponsorRequestId,
        req.body.voterName,
        req.body.voterCharacterId,
        req.body.value
      );

    res.json(preference);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to set sponsor request preference"
    });
  }
};

export const leavePetitionSponsorship = async (
  req: Request,
  res: Response
) => {
  try {
    const petitionId = Number(req.params.petitionId);

    const result = await leavePetitionSponsorshipData(
      petitionId,
      req.body.sponsorName,
      req.body.sponsorCharacterId
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to leave petition sponsorship"
    });
  }
};

export const supportPetition = async (
  req: Request,
  res: Response
) => {
  try {
    const petitionId = Number(req.params.petitionId);

    if (
      !petitionId ||
      (!req.body.supporterName &&
        !req.body.supporterCharacterId)
    ) {
      return res.status(400).json({
        error:
          "petitionId and supporterName or supporterCharacterId are required"
      });
    }

    const support = await supportPetitionData(
      petitionId,
      req.body.supporterName,
      req.body.supporterCharacterId
    );

    res.status(201).json(support);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to support petition"
    });
  }
};
