import mongoose from "mongoose";

const attendanceSessionSchema = new mongoose.Schema(
  {
    timetable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timetable",
      required: true,
    },

    // which specific session from timetable (Monday 9-10 etc.)
    sessionIndex: {
      type: Number,
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: String,
    endTime: String,
    room: String,

    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },

    totalStudents: { type: Number, default: 0 },
    presentCount: { type: Number, default: 0 },
    absentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 🔥 prevent duplicate session for same timetable + date + slot
attendanceSessionSchema.index(
  { timetable: 1, sessionIndex: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("AttendanceSession", attendanceSessionSchema);