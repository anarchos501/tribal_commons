import { Router } from "express";

import {
  getGovernanceTopics,
  createGovernanceTopic,
  setGovernancePreference,
  getGovernanceTemperature
} from "../controllers/policyController";

const router = Router();

router.get("/:tribeId", getGovernanceTopics);

router.get(
  "/topics/:topicId/temperature",
  getGovernanceTemperature
);

router.post("/topics", createGovernanceTopic);

router.post("/preferences", setGovernancePreference);

export default router;