import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";
import mongoose from "mongoose";
import AttendanceRecord from "../models/AttendanceRecord.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [totalStudents, totalTeachers, totalClasses] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Class.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalClasses,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



export const getDashboardChart = async (req, res) => {
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

      // 3. GROUP BY DAY OF WEEK (FIX)
      {
        $group: {
          _id: {
            dayNum: { $dayOfWeek: "$createdAt" }, // 1 = Sunday ... 7 = Saturday
          },
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "present"] }, 1, 0],
            },
          },
        },
      },

      // 4. MAP NUMBER → NAME + CALCULATE %
      {
        $project: {
          day: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.dayNum", 1] }, then: "Sun" },
                { case: { $eq: ["$_id.dayNum", 2] }, then: "Mon" },
                { case: { $eq: ["$_id.dayNum", 3] }, then: "Tue" },
                { case: { $eq: ["$_id.dayNum", 4] }, then: "Wed" },
                { case: { $eq: ["$_id.dayNum", 5] }, then: "Thu" },
                { case: { $eq: ["$_id.dayNum", 6] }, then: "Fri" },
                { case: { $eq: ["$_id.dayNum", 7] }, then: "Sat" },
              ],
              default: "Unknown",
            },
          },

          attendance: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$present", "$total"] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },

      // 5. ORDER DAYS PROPERLY
      {
        $addFields: {
          order: {
            $indexOfArray: [
              ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              "$day",
            ],
          },
        },
      },

      { $sort: { order: 1 } },

      // 6. CLEAN OUTPUT
      {
        $project: {
          _id: 0,
          day: 1,
          attendance: 1,
        },
      },
    ];

    const chart = await AttendanceRecord.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      data: chart,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};