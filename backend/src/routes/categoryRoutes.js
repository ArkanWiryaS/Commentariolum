import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
  getCategoryById,
  getNotesByCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/:id/notes", getNotesByCategory);

router.post("/", createCategory);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

export default router; 