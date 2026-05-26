import { Router } from "express";

import {
  getPetitions,
  createPetition,
  supportPetition
} from "../controllers/petitionController";

const router = Router();

router.get("/", getPetitions);
router.post("/", createPetition);
router.post("/:petitionId/support", supportPetition);

export default router;
