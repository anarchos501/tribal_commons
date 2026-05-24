import { Router } from "express";
import {
  getAllocations,
  createAllocation
} from "../controllers/commonsAllocationController";

const router = Router();

router.get("/", getAllocations);
router.post("/", createAllocation);

export default router;