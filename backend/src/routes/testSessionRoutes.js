import express from "express";
import {
  startTestSession,
  getTestSession,
  saveAnswer,
  submitTest,
  getAllTestSessions,
  getTestResults,
  getTestStats,
} from "../controllers/testSessionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (for students)
router.post("/start", startTestSession);
router.get("/:id", getTestSession);
router.put("/:id/answer", saveAnswer);
router.post("/:id/submit", submitTest);
router.get("/:id/results", getTestResults);

// Protected routes (admin only)
router.get("/", protect, getAllTestSessions);
router.get("/stats/overview", protect, getTestStats);

export default router;

