import { Router } from "express";

import {
  getTribesPage,
  createTribe
} from "../controllers/tribesPageController";

const router = Router();

router.get("/", getTribesPage);
router.post("/", createTribe);

export default router;