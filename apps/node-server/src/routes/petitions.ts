import { Router } from "express";

import {
  getPetitions,
  createPetition,
  supportPetition,
  invitePetitionSponsor,
  respondToSponsorInvite,
  requestPetitionSponsorship,
  setSponsorRequestPreference,
  leavePetitionSponsorship
} from "../controllers/petitionController";

const router = Router();

router.get("/", getPetitions);
router.post("/", createPetition);
router.post("/:petitionId/support", supportPetition);
router.post("/:petitionId/sponsor-invites", invitePetitionSponsor);
router.post("/:petitionId/sponsor-requests", requestPetitionSponsorship);
router.post("/:petitionId/sponsors/leave", leavePetitionSponsorship);
router.post(
  "/sponsor-requests/:sponsorRequestId/respond",
  respondToSponsorInvite
);
router.post(
  "/sponsor-requests/:sponsorRequestId/preference",
  setSponsorRequestPreference
);

export default router;
