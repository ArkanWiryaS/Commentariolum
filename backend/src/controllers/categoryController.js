import Category from "../models/Category.js";
import Note from "../models/Note.js";

// Mendapatkan semua kategori beserta jumlah notes
export async function getAllCategories(req, res) {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    
    // Update note count untuk setiap kategori
    for (let category of categories) {
      const noteCount = await Note.countDocuments({ categoryId: category._id });
      if (category.noteCount !== noteCount) {
        await Category.findByIdAndUpdate(category._id, { noteCount });
        category.noteCount = noteCount;
      }
    }
    
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error in getAllCategories Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Mendapatkan kategori berdasarkan ID
export async function getCategoryById(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    // Update note count
    const noteCount = await Note.countDocuments({ categoryId: category._id });
    if (category.noteCount !== noteCount) {
      await Category.findByIdAndUpdate(category._id, { noteCount });
      category.noteCount = noteCount;
    }
    
    res.status(200).json(category);
  } catch (error) {
    console.error("Error in getCategoryById Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Membuat kategori baru
export async function createCategory(req, res) {
  try {
    const { name, description, color, icon } = req.body;
    
    // Cek apakah nama kategori sudah ada
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, "i") } 
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: "Category name already exists" });
    }
    
    const category = new Category({ 
      name: name.trim(), 
      description: description?.trim() || "", 
      color: color || "primary",
      icon: icon || "Folder"
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error in createCategory Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update kategori
export async function updateCategory(req, res) {
  try {
    const { name, description, color, icon } = req.body;
    
    // Cek apakah nama kategori sudah ada (selain kategori yang sedang diupdate)
    if (name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: req.params.id }
      });
      
      if (existingCategory) {
        return res.status(400).json({ message: "Category name already exists" });
      }
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(color && { color }),
        ...(icon && { icon }),
      },
      { new: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error in updateCategory Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Hapus kategori
export async function deleteCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    // Cek apakah ada notes dalam kategori ini
    const noteCount = await Note.countDocuments({ categoryId: req.params.id });
    if (noteCount > 0) {
      // Update semua notes dalam kategori ini menjadi uncategorized
      await Note.updateMany(
        { categoryId: req.params.id },
        { $unset: { categoryId: 1 } }
      );
    }
    
    await Category.findByIdAndDelete(req.params.id);
    res.json({ 
      message: "Category deleted successfully",
      notesUpdated: noteCount 
    });
  } catch (error) {
    console.error("Error in deleteCategory Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Mendapatkan notes berdasarkan kategori
export async function getNotesByCategory(req, res) {
  try {
    const { id } = req.params;
    
    let notes;
    if (id === "uncategorized") {
      notes = await Note.find({ 
        $or: [
          { categoryId: null },
          { categoryId: { $exists: false } }
        ]
      }).sort({ createdAt: -1 });
    } else {
      // Validasi kategori exists
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      notes = await Note.find({ categoryId: id }).sort({ createdAt: -1 });
    }
    
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getNotesByCategory Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
} 