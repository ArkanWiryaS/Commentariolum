import mongoose from "mongoose";

const testSessionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed", "expired"],
      default: "in_progress",
    },
    totalTime: {
      type: Number, // in seconds
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    wrongAnswers: {
      type: Number,
      default: 0,
    },
    unanswered: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index untuk optimasi query
testSessionSchema.index({ studentId: 1 });
testSessionSchema.index({ subCategoryId: 1 });
testSessionSchema.index({ status: 1 });
testSessionSchema.index({ createdAt: -1 });

const TestSession = mongoose.model("TestSession", testSessionSchema);

export default TestSession;

