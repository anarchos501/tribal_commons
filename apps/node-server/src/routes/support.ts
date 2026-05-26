import { Router } from "express";

import {
  getSupportRequests,
  createSupportRequest
} from "../controllers/supportController";

const router = Router();

router.get("/requests", getSupportRequests);
router.post("/requests", createSupportRequest);

export default router;