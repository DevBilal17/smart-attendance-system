import Class from "../models/Class.js";

// CREATE CLASS
export const createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Class created successfully",
      data: newClass,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: err.message || "Internal Server Error",
      data: null,
    });
  }
};

// GET ALL CLASSES
export const getClasses = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.session) filter.session = req.query.session;
    if (req.query.degree) filter.degree = req.query.degree;

    const classes = await Class.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Class.countDocuments(filter);

    // 📊 STATS
    const totalClasses = await Class.countDocuments();
    const activeSessions = await Class.countDocuments({ session: "morning" });
    const semesters = await Class.distinct("semester");

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Classes fetched successfully",
      data: {
        classes,
        stats: {
          totalClasses,
          activeSessions,
          totalSemesters: semesters.length,
        },
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
      status: 500,
      message: err.message || "Internal Server Error",
      data: null,
    });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Class deleted successfully",
      data: deleted,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Class updated successfully",
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};