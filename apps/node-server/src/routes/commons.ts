import { Router } from "express";
import {
  getCommonsPools,
  createCommonsPool
} from "../controllers/commonsController";

const router = Router();

router.get("/", getCommonsPools);
router.post("/", createCommonsPool);

export default router;