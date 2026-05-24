import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController";

const router = Router();

router.get("/:playerName", getDashboard);

export default router;