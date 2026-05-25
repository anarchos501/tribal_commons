import { Router } from "express";

import {
  getUserAccounts,
  getUserAccount,
  createUserAccount,
  createCharacterProfile,
  deactivateUserAccount
} from "../controllers/accountController";

const router = Router();

router.get("/", getUserAccounts);

router.get("/:accountId", getUserAccount);

router.post("/", createUserAccount);

router.post("/characters", createCharacterProfile);

router.patch(
  "/:accountId/deactivate",
  deactivateUserAccount
);

export default router;