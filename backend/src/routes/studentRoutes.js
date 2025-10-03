import express from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsStats,
} from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (for student registration)
router.post("/", createStudent);

// Protected routes (admin only)
router.get("/", protect, getAllStudents);
router.get("/stats/overview", protect, getStudentsStats);
router.get("/:id", protect, getStudentById);
router.put("/:id", protect, updateStudent);
router.delete("/:id", protect, deleteStudent);

export default router;

