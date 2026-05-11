import Teacher from "../models/Teacher.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Subject from "../models/Subject.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";

/**
 * GET ALL TEACHERS
 * /api/teachers?page=1&limit=10&status=active&search=ali
 */


export const getTeachers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const status = req.query.status;

    const pipeline = [
      // 1. JOIN USER
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      // 2. JOIN SUBJECTS (NEW 🔥)
      {
        $lookup: {
          from: "subjects",
          localField: "_id",        // Teacher._id
          foreignField: "teacher",  // Subject.teacher
          as: "subjects",
        },
      },

      // 3. FILTER
      {
        $match: {
          ...(status && { "user.status": status }),

          ...(search && {
            $or: [
              { teacherId: { $regex: search, $options: "i" } },
              { "user.name": { $regex: search, $options: "i" } },
              { "user.email": { $regex: search, $options: "i" } },
              { "subjects.name": { $regex: search, $options: "i" } }, // 🔥 search in subjects too
            ],
          }),
        },
      },

      // 4. CLEAN OUTPUT
      {
        $project: {
          teacherId: 1,
          experience: 1,
          createdAt: 1,

          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
            status: "$user.status",
          },

          subjects: {
            $map: {
              input: "$subjects",
              as: "sub",
              in: {
                _id: "$$sub._id",
                name: "$$sub.name",
              },
            },
          },
        },
      },

      // 5. FACET (pagination + stats)
      {
        $facet: {
          teachers: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],

          totalCount: [{ $count: "count" }],

          stats: [
            {
              $group: {
                _id: null,
                totalTeachers: { $sum: 1 },
                activeTeachers: {
                  $sum: {
                    $cond: [{ $eq: ["$user.status", "active"] }, 1, 0],
                  },
                },
                inactiveTeachers: {
                  $sum: {
                    $cond: [{ $eq: ["$user.status", "inactive"] }, 1, 0],
                  },
                },
              },
            },
          ],
        },
      },
    ];

    const result = await Teacher.aggregate(pipeline);

    const teachers = result[0]?.teachers || [];
    const total = result[0]?.totalCount?.[0]?.count || 0;
    const stats = result[0]?.stats?.[0] || {
      totalTeachers: 0,
      activeTeachers: 0,
      inactiveTeachers: 0,
    };

    return res.status(200).json({
      success: true,
      message: "Teachers fetched successfully",
      data: {
        teachers,
        stats,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, teacherId,  experience } = req.body;
    console.log(req.body)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const existingTeacher = await Teacher.findOne({ teacherId });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      status: "active",
    });

    const teacher = await Teacher.create({
      user: user._id,
      teacherId,
      // subject,
      experience,
    });

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: { teacher, user }, // ✅ return both
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, subject, teacherId,experience, status } = req.body;
    console.log(req.body)
    const teacher = await Teacher.findById(id).populate("user");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // 🔹 update teacher profile
    // teacher.subject = subject ?? teacher.subject;
    teacher.experience = experience ?? teacher.experience;
    teacher.teacherId = teacherId ?? teacher.teacherId;
    await teacher.save();

    // 🔹 update user data
    if (teacher.user) {
      teacher.user.name = name ?? teacher.user.name;
      teacher.user.email = email ?? teacher.user.email;
      teacher.user.status = status ?? teacher.user.status;

      await teacher.user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // delete user
    await User.findByIdAndDelete(teacher.user);

    // delete teacher profile
    await Teacher.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id).populate("user");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Teacher fetched successfully",
      data: teacher,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



export const getTeacherProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. GET TEACHER (with user info)
    const teacher = await Teacher.findOne({ user: userId })
      .populate("user");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // 2. GET SUBJECTS (with class details)
    const subjects = await Subject.find({ teacher: teacher._id })
      .populate("classId");

    // 3. ENHANCE SUBJECTS WITH STUDENT COUNT
    const subjectsWithStats = await Promise.all(
      subjects.map(async (sub) => {
        const studentCount = await Student.countDocuments({
          class: sub.classId._id,
        });

        return {
          _id: sub._id,
          name: sub.name,
          code: sub.code,
          creditHours: sub.creditHours,
          class: sub.classId,
          studentCount,
        };
      })
    );

    // 4. TOTAL CLASSES (unique)
    const totalClasses = await Subject.distinct("classId", {
      teacher: teacher._id,
    });

    // 5. TOTAL STUDENTS (across all classes)
    const totalStudents = await Student.countDocuments({
      class: { $in: totalClasses },
    });

    // 6. FINAL RESPONSE (dashboard ready)
    return res.status(200).json({
      success: true,
      message: "Teacher dashboard fetched successfully",
      data: {
        teacher,
        subjects: subjectsWithStats,
        stats: {
          totalSubjects: subjects.length,
          totalClasses: totalClasses.length,
          totalStudents,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getTeacherAssignments = async (req, res) => {
  try {
    const teacherId = req.params.id; // teacher _id
    // console.log("Fetching assignments for teacher ID:", teacherId);
    const teacher = await Teacher.findOne({ user: teacherId });
    // console.log(teacher)
    const assignments = await Subject.find({ teacher: teacher._id })
      .populate("classId", "degree semester batchStart batchEnd session")
      .select("name code classId");

    const formatted = assignments.map((sub) => ({
      subject: {
        _id: sub._id,
        name: sub.name,
        code: sub.code,
      },
      class: sub.classId,
    }));

    return res.status(200).json({
      success: true,
      message: "Teacher assignments fetched successfully",
      data: formatted,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};