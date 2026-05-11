import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import Student from "../models/Student.js";
import AttendanceSession from "../models/AttendanceSession.js";
import AttendanceRecord from "../models/AttendanceRecord.js";
import { generateReportPDF } from "../utils/generateReportPDF.js";
import Teacher from "../models/Teacher.js";
import TimeTable from "../models/Timetable.js";
import mongoose from "mongoose";
export const formatDate = (date) => {
  const d = new Date(date);

  const day = d.toLocaleDateString("en-PK", { weekday: "short" });
  const dateStr = d.toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  const time = d.toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${day}, ${dateStr} • ${time}`;
};
const normalizeDate = (inputDate) => {
  const d = new Date(inputDate || Date.now());
  d.setHours(0, 0, 0, 0); // remove time
  return d;
};
const cosineSimilarity = (a, b) => {
  let dot = 0,
    magA = 0,
    magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};


export const startSession = async (req, res) => {
  try {
    const { timetable, sessionIndex, date } = req.body;

    if (!timetable || sessionIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing timetable or sessionIndex",
      });
    }

    const tt = await TimeTable.findById(timetable)
      .populate("classId")
      .populate("subject")
      .populate("teacher");

    if (!tt) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    const sessionSlot = tt.sessions[sessionIndex];

    if (!sessionSlot) {
      return res.status(400).json({
        success: false,
        message: "Invalid session index",
      });
    }

    // 🔥 NORMALIZED DATE
    const normalizedDate = normalizeDate(date);

    // 🔥 prevent duplicate session
    const existing = await AttendanceSession.findOne({
      timetable,
      sessionIndex,
      date: normalizedDate,
      status: "ongoing",
    });

    if (existing) {
      return res.json({
        success: true,
        message: "Session already active",
        data: existing,
      });
    }

    const session = await AttendanceSession.create({
      timetable,
      sessionIndex,

      classId: tt.classId._id,
      subject: tt.subject._id,
      teacher: tt.teacher._id,

      date: normalizedDate,   // ✅ CLEAN DATE HERE

      startTime: sessionSlot.startTime,
      endTime: sessionSlot.endTime,
      room: tt.room,

      status: "ongoing",
    });

    return res.json({
      success: true,
      message: "Session started successfully",
      data: session,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const markAttendance = async (req, res) => {
  const file = req.file;

  try {
    const { classId, subjectId, teacherId } = req.body;

    if (!classId || !subjectId || !teacherId || !file) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 1️⃣ AI EMBEDDING
    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.path));

    const response = await axios.post(
      "http://localhost:8000/embed",
      formData,
      { headers: formData.getHeaders() }
    );

    if (!response.data.success || !response.data.vector) {
      return res.status(400).json({
        success: false,
        message: "Face not detected",
      });
    }

    const inputVector = response.data.vector;

    // 2️⃣ GET STUDENTS
    const students = await Student.find({
      class: classId,
      "embeddings.0": { $exists: true },
    });

    let bestMatch = null;
    let bestScore = 0;
    const THRESHOLD = 0.75;

    // 3️⃣ MATCH
    for (const student of students) {
      for (const emb of student.embeddings) {
        const score = cosineSimilarity(inputVector, emb.vector);

        if (score > bestScore) {
          bestScore = score;
          bestMatch = student;
        }
      }
    }

    // 4️⃣ UNKNOWN PERSON
    if (!bestMatch || bestScore < THRESHOLD) {
      return res.json({
        success: true,
        type: "UNKNOWN",
        message: "Person not recognized",
        data: null,
      });
    }

    // 5️⃣ GET SESSION
    console.log("BODY DATA:");
console.log({
  classId,
  subjectId,
  teacherId,
});
const allSessions = await AttendanceSession.find();

console.log(
  "ALL SESSIONS:",
  allSessions.map((s) => ({
    id: s._id,
    classId: s.classId,
    subject: s.subject,
    teacher: s.teacher,
    status: s.status,
  }))
);
let session = await AttendanceSession.findOne({
  classId,
  subject: subjectId,
  teacher: teacherId,
  status: "ongoing",
});

console.log("FOUND SESSION:", session);

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "No active session found",
      });
    }

    // 6️⃣ DUPLICATE CHECK
    const existing = await AttendanceRecord.findOne({
      session: session._id,
      student: bestMatch._id,
    });

    if (existing) {
      return res.json({
        success: true,
        type: "ALREADY_MARKED",
        message: `${bestMatch.name} already marked`,
        data: existing,
      });
    }

    // 7️⃣ LATE LOGIC (OPTIONAL 🔥)
    const sessionStart = new Date(session.startTime || session.createdAt);
    const now = new Date();
    const diffMinutes = (now - sessionStart) / (1000 * 60);

    let status = diffMinutes > 10 ? "late" : "present";

    // 8️⃣ CREATE RECORD
    const record = await AttendanceRecord.create({
      session: session._id,
      student: bestMatch._id,
      status,
      confidence: bestScore,
    });

    return res.json({
      success: true,
      type: "MARKED",
      message: `${bestMatch.name} marked ${status}`,
      data: {
        student: {
          id: bestMatch._id,
          name: bestMatch.name,
          rollNumber: bestMatch.rollNumber,
        },
        confidence: bestScore,
        record,
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    // 🔥 DELETE FILE (VERY IMPORTANT)
    if (file?.path) {
      fs.unlink(file.path, () => {});
    }
  }
};


export const stopSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    // 1️⃣ GET SESSION
    const session = await AttendanceSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.status === "completed") {
      return res.json({
        success: true,
        message: "Session already completed",
      });
    }

    // 2️⃣ ALL STUDENTS
    const students = await Student.find({
      class: session.classId,
    });

    // 3️⃣ PRESENT RECORDS
    const records = await AttendanceRecord.find({
      session: session._id,
    });

    const presentIds = records.map((r) =>
      r.student.toString()
    );

    // 4️⃣ ABSENT STUDENTS
    const absentStudents = students.filter(
      (s) => !presentIds.includes(s._id.toString())
    );

    // 5️⃣ MARK ABSENT
    for (const student of absentStudents) {
      await AttendanceRecord.updateOne(
        {
          session: session._id,
          student: student._id,
        },
        {
          $setOnInsert: {
            session: session._id,
            student: student._id,
            status: "absent",
          },
        },
        { upsert: true }
      );
    }

    // 6️⃣ CLOSE SESSION
    session.status = "completed";
    session.endTime = new Date();
    await session.save();

    return res.json({
      success: true,
      message: "Session stopped successfully",
      data: {
        total: students.length,
        present: records.length,
        absent: absentStudents.length,
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const buildReport = async ({ classId, subjectId, startDate }) => {
  const sessions = await AttendanceSession.find({
    classId,
    subject: subjectId,
    createdAt: { $gte: startDate },
  });

  const sessionIds = sessions.map((s) => s._id);

  const records = await AttendanceRecord.find({
    session: { $in: sessionIds },
  }).populate("student");

  return { sessions, records };
};

export const getTeacherReport = async (req, res) => {
  try {
    const { classId, subjectId, type } = req.query;
    const { teacherId } = req.params;
    const teacher = await Teacher.findOne({ user: teacherId});
    console.log(teacher)
    if (!teacher) {
      return res.status(403).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // 🔥 date filter
    let startDate = new Date();
    if (type === "daily") startDate.setHours(0, 0, 0, 0);
    if (type === "weekly") startDate.setDate(startDate.getDate() - 7);
    if (type === "monthly") startDate.setMonth(startDate.getMonth() - 1);

    // 🔥 IMPORTANT: teacher restriction
    const { sessions, records } = await buildReport({
      classId,
      subjectId,
      startDate,
    });

    const enrichedRecords = records.map((r) => ({
  ...r._doc,
date: new Date(r.createdAt).toISOString().split("T")[0],
time: new Date(r.createdAt).toLocaleTimeString("en-US", {
  hour: "2-digit",
  minute: "2-digit",
}),
}));
    console.log("Sessions before filter:", sessions.length)
    // filter teacher-owned sessions only
    const filteredSessions = sessions.filter(
      (s) => s.teacher.toString() === teacher._id.toString()
    );

    return res.json({
      success: true,
      role: "teacher",
      data: {
        sessions: filteredSessions,
        records: enrichedRecords,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAdminReport = async (req, res) => {
  try {
    const { classId, subjectId, type } = req.query;

    // 🔥 date filter
    let startDate = new Date();
    if (type === "daily") startDate.setHours(0, 0, 0, 0);
    if (type === "weekly") startDate.setDate(startDate.getDate() - 7);
    if (type === "monthly") startDate.setMonth(startDate.getMonth() - 1);

    const { sessions, records } = await buildReport({
      classId,
      subjectId,
      startDate,
    });

    return res.json({
      success: true,
      role: "admin",
      data: {
        sessions,
        records,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const exportTeacherReportPDF = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { classId, subjectId } = req.query;

    // 1️⃣ BUILD FILTER DYNAMICALLY
    const filter = {
      teacher: teacherId,
    };

    if (classId) filter.classId = classId;
    if (subjectId) filter.subject = subjectId;

    // 2️⃣ GET FILTERED SESSIONS
    const sessions = await AttendanceSession.find(filter)
      .populate("classId")
      .populate("subject")
      .populate("teacher");

    if (!sessions.length) {
      return res.status(404).json({
        success: false,
        message: "No sessions found for selected filters",
      });
    }

    const sessionIds = sessions.map((s) => s._id);

    // 3️⃣ GET ATTENDANCE RECORDS
    const records = await AttendanceRecord.find({
      session: { $in: sessionIds },
    }).populate("student");

    // 4️⃣ SEND TO PDF GENERATOR
    return generateReportPDF(
      {
        sessions,
        records,
        filters: { classId, subjectId },
      },
      res
    );

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const exportAdminReportPDF = async (req, res) => {
  try {
    const { classId, subjectId, teacherId } = req.query;

    // 1️⃣ BUILD DYNAMIC FILTER
    const filter = {};

    if (classId) filter.classId = classId;
    if (subjectId) filter.subject = subjectId;
    if (teacherId) filter.teacher = teacherId;

    // 2️⃣ GET SESSIONS (ALL OR FILTERED)
    const sessions = await AttendanceSession.find(filter)
      .populate("classId")
      .populate("subject")
      .populate("teacher");

    if (!sessions.length) {
      return res.status(404).json({
        success: false,
        message: "No sessions found for selected filters",
      });
    }

    const sessionIds = sessions.map((s) => s._id);

    // 3️⃣ GET ATTENDANCE RECORDS
    const records = await AttendanceRecord.find({
      session: { $in: sessionIds },
    })
      .populate("student")
      .populate("session");

    // 4️⃣ ENRICH DATA (IMPORTANT FOR ADMIN REPORTS)
    const enrichedSessions = sessions.map((s) => ({
      sessionId: s._id,
      class: s.classId?.degree + " Sem " + s.classId?.semester,
      subject: s.subject?.name,
      teacher: s.teacher?.name,
      status: s.status,
      date: s.date,
    }));

    const enrichedRecords = records.map((r) => ({
      student: r.student?.name,
      rollNumber: r.student?.rollNumber,
      class: r.session?.classId,
      subject: r.session?.subject,
      status: r.status,
      confidence: r.confidence,
      timestamp: r.timestamp,
    }));

    // 5️⃣ GENERATE PDF
    return generateReportPDF(
      {
        sessions: enrichedSessions,
        records: enrichedRecords,
        filters: { classId, subjectId, teacherId },
        generatedFor: "ADMIN",
      },
      res
    );

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const getClassReport = async (req, res) => {
  try {
    const { classId, subjectId } = req.query;

    const pipeline = [
      // 1. JOIN SESSION
      {
        $lookup: {
          from: "attendancesessions",
          localField: "session",
          foreignField: "_id",
          as: "session",
        },
      },
      { $unwind: "$session" },

      // 2. FILTER
      {
        $match: {
          ...(classId && {
            "session.classId": new mongoose.Types.ObjectId(classId),
          }),
          ...(subjectId && {
            "session.subject": new mongoose.Types.ObjectId(subjectId),
          }),
        },
      },

      // 3. JOIN STUDENT
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },

      // 4. GROUP BY STUDENT + DATE
      {
        $group: {
          _id: {
            studentId: "$student._id",
            date: "$session.date",
          },
          student: { $first: "$student" },
          status: { $first: "$status" },
        },
      },

      // 5. SECOND GROUP (STUDENT LEVEL)
      {
        $group: {
          _id: "$student._id",
          student: { $first: "$student" },

          attendance: {
            $push: {
              date: "$_id.date",
              status: "$status",
            },
          },

          presentCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "present"] }, 1, 0],
            },
          },

          absentCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "absent"] }, 1, 0],
            },
          },
        },
      },

      // 6. FINAL SHAPE
      {
        $project: {
          _id: 0,
          studentId: "$student._id",
          name: "$student.name",
          rollNumber: "$student.rollNumber",

          attendance: {
            $sortArray: {
              input: "$attendance",
              sortBy: { date: 1 },
            },
          },

          presentCount: 1,
          absentCount: 1,

          attendancePercentage: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$presentCount",
                      { $add: ["$presentCount", "$absentCount"] },
                    ],
                  },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
    ];

    const report = await AttendanceRecord.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};














// export const getAttendanceReport = async (req, res) => {
//   try {
//     const { classId, subjectId, teacherId, type } = req.query;

//     if (!classId || !subjectId || !teacherId) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing filters",
//       });
//     }

//     let startDate = new Date();

//     // 🔥 TIME FILTER LOGIC
//     if (type === "daily") {
//       startDate.setHours(0, 0, 0, 0);
//     }

//     if (type === "weekly") {
//       startDate.setDate(startDate.getDate() - 7);
//     }

//     if (type === "monthly") {
//       startDate.setMonth(startDate.getMonth() - 1);
//     }

//     // 1️⃣ Get sessions
//     const sessions = await AttendanceSession.find({
//       classId,
//       subject: subjectId,
//       teacher: teacherId,
//       createdAt: { $gte: startDate },
//     });

//     const sessionIds = sessions.map((s) => s._id);

//     // 2️⃣ Get records
//     const records = await AttendanceRecord.find({
//       session: { $in: sessionIds },
//     })
//       .populate("student", "name rollNumber registrationNumber")
//       .populate("session", "date");

//     // 3️⃣ GROUP BY STUDENT (REPORT CORE LOGIC)
//     const reportMap = new Map();

//     for (let record of records) {
//       const sid = record.student._id.toString();

//       if (!reportMap.has(sid)) {
//         reportMap.set(sid, {
//           student: record.student,
//           present: 0,
//           absent: 0,
//           late: 0,
//           total: 0,
//         });
//       }

//       const data = reportMap.get(sid);

//       data.total += 1;

//       if (record.status === "present") data.present++;
//       if (record.status === "absent") data.absent++;
//       if (record.status === "late") data.late++;
//     }

//     const report = Array.from(reportMap.values());

//     // 4️⃣ CLASS SUMMARY
//     const summary = {
//       totalSessions: sessions.length,
//       totalStudents: report.length,
//     };

//     return res.json({
//       success: true,
//       message: "Report generated",
//       data: {
//         summary,
//         report,
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };