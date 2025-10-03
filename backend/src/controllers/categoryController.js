import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import Question from "../models/Question.js";

// @desc    Get all categories
// @route   GET /api/categories
export async function getAllCategories(req, res) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Get category by ID with subcategories
// @route   GET /api/categories/:id
export async function getCategoryById(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Get subcategories
    const subCategories = await SubCategory.find({ 
      categoryId: req.params.id,
      isActive: true 
    }).sort({ order: 1 });

    res.status(200).json({
      ...category.toObject(),
      subCategories,
    });
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Create category
// @route   POST /api/categories
export async function createCategory(req, res) {
  try {
    const { name, description, order } = req.body;

    const category = await Category.create({
      name,
      description,
      order: order || 0,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Error in createCategory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Update category
// @route   PUT /api/categories/:id
export async function updateCategory(req, res) {
  try {
    const { name, description, order, isActive } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, order, isActive },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error in updateCategory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Delete category
// @route   DELETE /api/categories/:id
export async function deleteCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if category has subcategories
    const subCategoryCount = await SubCategory.countDocuments({ categoryId: req.params.id });
    if (subCategoryCount > 0) {
      return res.status(400).json({ 
        message: "Cannot delete category with existing subcategories. Delete subcategories first." 
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

