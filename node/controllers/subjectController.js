import Subject from "../models/Subject.js";



// CREATE
export const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);

    res.status(201).json({
      success: true,
      message: "Subject created",
      data: subject,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET SUBJECTS
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate({
    path: "teacher",
    populate: {
      path: "user",   // 👈 nested populate
    },
  })
      .populate("classId")
      .sort({ createdAt: -1 });

    const total = await Subject.countDocuments();

    const active = await Subject.countDocuments({ status: "active" });

    const inactive = await Subject.countDocuments({ status: "inactive" });

    res.status(200).json({
      success: true,
      message: "Subjects fetched",
      data: {
        subjects,
        stats: {
          totalSubjects: total,
          activeSubjects: active,
          inactiveSubjects: inactive,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Subject updated",
      data: subject,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Subject deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};