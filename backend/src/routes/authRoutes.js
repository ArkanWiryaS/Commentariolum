import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerAdmin); // For initial setup, can be disabled later
router.post("/login", loginAdmin);

// Protected routes
router.get("/profile", protect, getAdminProfile);

export default router;

