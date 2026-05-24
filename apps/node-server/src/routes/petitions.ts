import { Router } from "express";
import {
  getPetitions,
  createPetition
} from "../controllers/petitionController";

const router = Router();

router.get("/", getPetitions);
router.post("/", createPetition);

export default router;