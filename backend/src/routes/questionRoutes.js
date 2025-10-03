import express from "express";
import {
  getAllQuestions,
  getQuestionById,
  getQuestionsForTest,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions,
} from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (for students taking test)
router.get("/test/:subCategoryId", getQuestionsForTest);

// Protected routes (admin only)
router.get("/", protect, getAllQuestions);
router.get("/:id", protect, getQuestionById);
router.post("/", protect, createQuestion);
router.post("/bulk", protect, bulkCreateQuestions);
router.put("/:id", protect, updateQuestion);
router.delete("/:id", protect, deleteQuestion);

export default router;

