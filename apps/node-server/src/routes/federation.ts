import { Router } from "express";

import {
  getFederationRelationships,
  createFederationRelationship
} from "../controllers/federationController";

const router = Router();

router.get(
  "/:sourceTribeId",
  getFederationRelationships
);

router.post(
  "/",
  createFederationRelationship
);

export default router;