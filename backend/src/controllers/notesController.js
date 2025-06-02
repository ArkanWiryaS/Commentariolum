import Note from "../models/Note.js";
import Category from "../models/Category.js";

export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find()
      .populate('categoryId', 'name color icon')
      .sort({ createdAt: -1 }); // -1 untuk yang terbaru jadi latest
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id)
      .populate('categoryId', 'name color icon');
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteById Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content, categoryId } = req.body;
    
    // Validasi kategori jika ada
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: "Invalid category" });
      }
    }
    
    const note = new Note({ 
      title, 
      content, 
      ...(categoryId && { categoryId })
    });

    const savedNote = await note.save();
    
    // Populate category info sebelum return
    await savedNote.populate('categoryId', 'name color icon');
    
    // Update note count di kategori
    if (categoryId) {
      await Category.findByIdAndUpdate(
        categoryId,
        { $inc: { noteCount: 1 } }
      );
    }
    
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content, categoryId } = req.body;
    
    // Dapatkan note lama untuk update note count
    const oldNote = await Note.findById(req.params.id);
    if (!oldNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    // Validasi kategori jika ada
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: "Invalid category" });
      }
    }
    
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
      },
      { new: true }
    ).populate('categoryId', 'name color icon');
    
    // Update note count di kategori lama dan baru
    if (oldNote.categoryId && oldNote.categoryId.toString() !== categoryId) {
      await Category.findByIdAndUpdate(
        oldNote.categoryId,
        { $inc: { noteCount: -1 } }
      );
    }
    
    if (categoryId && categoryId !== oldNote.categoryId?.toString()) {
      await Category.findByIdAndUpdate(
        categoryId,
        { $inc: { noteCount: 1 } }
      );
    }
    
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    // Update note count di kategori
    if (deletedNote.categoryId) {
      await Category.findByIdAndUpdate(
        deletedNote.categoryId,
        { $inc: { noteCount: -1 } }
      );
    }
    
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNote Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
