import { Router } from "express";
import {
  getContributions,
  createContribution
} from "../controllers/contributionController";

const router = Router();

router.get("/", getContributions);
router.post("/", createContribution);

export default router;