import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "Tribal Commons Backend"
  });
});

export default router;