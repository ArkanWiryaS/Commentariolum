import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    optionA: {
      type: String,
      required: true,
    },
    optionB: {
      type: String,
      required: true,
    },
    optionC: {
      type: String,
      required: true,
    },
    optionD: {
      type: String,
      required: true,
    },
    optionE: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
      enum: ["A", "B", "C", "D", "E"],
    },
    explanation: {
      type: String,
      default: "",
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
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
questionSchema.index({ subCategoryId: 1 });
questionSchema.index({ order: 1 });
questionSchema.index({ isActive: 1 });

const Question = mongoose.model("Question", questionSchema);

export default Question;

