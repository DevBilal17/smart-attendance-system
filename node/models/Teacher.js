import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
 {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    teacherId: {
      type: String,
      unique: true,
      required: true,
    },

    experience: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);