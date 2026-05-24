import { Router } from "express";
import {
  getAidRequests,
  createAidRequest,
  getAidContributions,
  createAidContribution
} from "../controllers/aidController";

const router = Router();

router.get("/requests", getAidRequests);
router.post("/requests", createAidRequest);

router.get("/contributions", getAidContributions);
router.post("/contributions", createAidContribution);

export default router;