import SubCategory from "../models/SubCategory.js";
import Question from "../models/Question.js";

// @desc    Get all subcategories
// @route   GET /api/subcategories
export async function getAllSubCategories(req, res) {
  try {
    const { categoryId } = req.query;
    const filter = { isActive: true };
    
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const subCategories = await SubCategory.find(filter)
      .populate("categoryId", "name")
      .sort({ order: 1 });
    
    res.status(200).json(subCategories);
  } catch (error) {
    console.error("Error in getAllSubCategories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Get subcategory by ID
// @route   GET /api/subcategories/:id
export async function getSubCategoryById(req, res) {
  try {
    const subCategory = await SubCategory.findById(req.params.id)
      .populate("categoryId", "name");
    
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    res.status(200).json(subCategory);
  } catch (error) {
    console.error("Error in getSubCategoryById:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Create subcategory
// @route   POST /api/subcategories
export async function createSubCategory(req, res) {
  try {
    const { name, categoryId, questionCount, timeLimit, order } = req.body;

    const subCategory = await SubCategory.create({
      name,
      categoryId,
      questionCount: questionCount || 0,
      timeLimit: timeLimit || 60,
      order: order || 0,
    });

    await subCategory.populate("categoryId", "name");

    res.status(201).json(subCategory);
  } catch (error) {
    console.error("Error in createSubCategory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Update subcategory
// @route   PUT /api/subcategories/:id
export async function updateSubCategory(req, res) {
  try {
    const { name, categoryId, questionCount, timeLimit, order, isActive } = req.body;

    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { name, categoryId, questionCount, timeLimit, order, isActive },
      { new: true }
    ).populate("categoryId", "name");

    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    res.status(200).json(subCategory);
  } catch (error) {
    console.error("Error in updateSubCategory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Delete subcategory
// @route   DELETE /api/subcategories/:id
export async function deleteSubCategory(req, res) {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    // Check if subcategory has questions
    const questionCount = await Question.countDocuments({ subCategoryId: req.params.id });
    if (questionCount > 0) {
      return res.status(400).json({ 
        message: "Cannot delete subcategory with existing questions. Delete questions first." 
      });
    }

    await SubCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "SubCategory deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSubCategory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

