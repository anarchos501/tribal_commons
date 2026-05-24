import { Router } from "express";

import {
  getAidRequests,
  createAidRequest
} from "../controllers/aidController";

const router = Router();

router.get("/requests", getAidRequests);
router.post("/requests", createAidRequest);

export default router;