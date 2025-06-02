import mongoose from "mongoose";

// 1. buat schmea
// 2. buat model berdasarkan schema

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

// Index untuk optimasi query
noteSchema.index({ categoryId: 1 });
noteSchema.index({ createdAt: -1 });

const Note = mongoose.model("Note", noteSchema);

export default Note;
