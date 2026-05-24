import { Router } from "express";
import {
  getTribes,
  createTribe
} from "../controllers/tribeController";

const router = Router();

router.get("/", getTribes);
router.post("/", createTribe);

export default router;