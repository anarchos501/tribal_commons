import { Router } from "express";

import {
  getSupportRequests,
  createSupportRequest,
  supportSupportRequest
} from "../controllers/supportController";

const router = Router();

router.get("/requests", getSupportRequests);
router.post("/requests", createSupportRequest);
router.post(
  "/requests/:supportRequestId/support",
  supportSupportRequest
);

export default router;
