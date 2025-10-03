import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    testSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestSession",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    selectedAnswer: {
      type: String,
      enum: ["A", "B", "C", "D", "E", null],
      default: null,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    markedForReview: {
      type: Boolean,
      default: false,
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0,
    },
  },
  { timestamps: true }
);

// Index untuk optimasi query
answerSchema.index({ testSessionId: 1 });
answerSchema.index({ questionId: 1 });

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;

