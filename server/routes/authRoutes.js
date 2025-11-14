import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Verify authentication endpoint
router.get("/verify", requireAuth, (req, res) => {
  res.json({ valid: true, user: req.user });
});

export default router;