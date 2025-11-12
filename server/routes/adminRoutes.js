import express from "express";
import { registerAdmin, loginAdmin, logoutAdmin } from "../controller/adminController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

// Protected route to verify JWT token
router.get("/me", requireAuth, (req, res) => {
  res.json({ 
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

export default router;