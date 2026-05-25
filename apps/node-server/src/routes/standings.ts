import { Router } from "express";

import {
  getPersonalStandings,
  createPersonalStanding
} from "../controllers/standingController";

const router = Router();

router.get("/:observerName", getPersonalStandings);

router.post("/", createPersonalStanding);

export default router;