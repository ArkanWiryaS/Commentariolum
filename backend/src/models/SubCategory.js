import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    questionCount: {
      type: Number,
      default: 0,
    },
    timeLimit: {
      type: Number, // in minutes
      required: true,
      default: 60,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index untuk optimasi query
subCategorySchema.index({ categoryId: 1 });
subCategorySchema.index({ order: 1 });
subCategorySchema.index({ isActive: 1 });

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;

