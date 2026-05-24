import { Router } from "express";
import {
  getMemberships,
  createMembership
} from "../controllers/membershipController";

const router = Router();

router.get("/", getMemberships);
router.post("/", createMembership);

export default router;