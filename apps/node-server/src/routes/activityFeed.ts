import { Router } from "express";
import { getActivityFeed } from "../controllers/activityFeedController";

const router = Router();

router.get("/", getActivityFeed);

export default router;