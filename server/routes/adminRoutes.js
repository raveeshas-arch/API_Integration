import express from "express";
import { registerAdmin, loginAdmin, logoutAdmin } from "../controller/adminController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register",registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", requireAuth ,logoutAdmin);



export default router;