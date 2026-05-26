import { Router } from "express";

import {
  getGovernanceTopics,
  createGovernanceTopic,
  setGovernancePreference,
  getGovernanceTemperature,
  backfillDefaultGovernanceTopics,
  getProjectGovernanceTopics
} from "../controllers/policyController";

const router = Router();

router.post(
  "/defaults/backfill",
  backfillDefaultGovernanceTopics
);

router.get(
  "/topics/:topicId/temperature",
  getGovernanceTemperature
);

router.get(
  "/projects/:projectId",
  getProjectGovernanceTopics
);

router.get("/:tribeId", getGovernanceTopics);

router.post("/topics", createGovernanceTopic);

router.post("/preferences", setGovernancePreference);

export default router;
