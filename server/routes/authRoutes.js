import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Verify authentication endpoint
router.get("/verify", requireAuth, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

export default router;