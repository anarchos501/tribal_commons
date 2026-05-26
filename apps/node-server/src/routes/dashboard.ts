import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController";

const router = Router();

router.get("/:characterName", getDashboard);

export default router;