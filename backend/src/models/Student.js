import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: true,
    },
    targetUniversity: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

// Index untuk optimasi query
studentSchema.index({ email: 1 });
studentSchema.index({ school: 1 });
studentSchema.index({ createdAt: -1 });

const Student = mongoose.model("Student", studentSchema);

export default Student;

