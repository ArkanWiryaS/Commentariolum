import express from "express";
import {
  getAllSubCategories,
  getSubCategoryById,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllSubCategories);
router.get("/:id", getSubCategoryById);

// Protected routes (admin only)
router.post("/", protect, createSubCategory);
router.put("/:id", protect, updateSubCategory);
router.delete("/:id", protect, deleteSubCategory);

export default router;

