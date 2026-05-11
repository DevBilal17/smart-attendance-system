import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttendanceSession",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "absent",
    },

    confidence: {
      type: Number,
    },

    flag: {
      type: String,
      enum: [
        "none",
        "face_mismatch",
        "no_face",
        "multiple_faces",
        "early_leave",
      ],
      default: "none",
    },

    // 🔥 NEW (IMPORTANT)
    markedBy: {
      type: String,
      enum: ["ai", "teacher", "system"],
      default: "ai",
    },

    method: {
      type: String,
      enum: ["face", "manual", "bulk"],
      default: "face",
    },

    imageUrl: String,

    markedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// prevent duplicate attendance
attendanceRecordSchema.index(
  { session: 1, student: 1 },
  { unique: true }
);

// 🔥 NEW INDEXES for reports
attendanceRecordSchema.index({ createdAt: -1 });
attendanceRecordSchema.index({ session: 1, student: 1, status: 1 });
attendanceRecordSchema.index(
  { session: 1, student: 1 },
  { unique: true }
);

// 🔥 better reporting index
attendanceRecordSchema.index({ session: 1, status: 1 });
attendanceRecordSchema.index({ student: 1, createdAt: -1 });
export default mongoose.model("AttendanceRecord", attendanceRecordSchema);