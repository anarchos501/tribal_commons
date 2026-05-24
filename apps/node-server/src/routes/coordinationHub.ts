import { Router } from "express";
import { getCoordinationHub } from "../controllers/coordinationHubController";

const router = Router();

router.get("/", getCoordinationHub);

export default router;