import { Router } from "express";
import { getNotifications } from "../controllers/notificationController";

const router = Router();

router.get("/:playerName", getNotifications);

export default router;