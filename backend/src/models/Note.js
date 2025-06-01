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
    tanggal : {
      type : Date,
      required : false,
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
