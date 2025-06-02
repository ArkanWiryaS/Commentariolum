import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    description: {
      type: String,
      maxLength: 200,
      default: "",
    },
    color: {
      type: String,
      default: "primary",
      enum: [
        "primary",
        "secondary", 
        "accent",
        "info",
        "success",
        "warning",
        "error",
        "neutral"
      ],
    },
    icon: {
      type: String,
      default: "Folder",
    },
    noteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index untuk optimasi query
categorySchema.index({ name: 1 });

const Category = mongoose.model("Category", categorySchema);

export default Category; 