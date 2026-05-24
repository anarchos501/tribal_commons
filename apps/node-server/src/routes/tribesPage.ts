import { Router } from "express";
import { getTribesPage } from "../controllers/tribesPageController";

const router = Router();

router.get("/", getTribesPage);

export default router;