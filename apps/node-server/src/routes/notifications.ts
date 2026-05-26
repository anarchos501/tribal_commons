import { Router } from "express";
import { getNotifications } from "../controllers/notificationController";

const router = Router();

router.get("/:characterName", getNotifications);

export default router;