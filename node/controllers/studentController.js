import Student from "../models/Student.js";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";

export const createStudent = async (req, res) => {
  try {
    const { name, class: classId, rollNumber, registrationNumber } = req.body;
    let successCount = 0;
    let failCount = 0;
    if (!name || !classId || !rollNumber || !registrationNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const files = req.files;

    if (!files || files.length < 5) {
      return res.status(400).json({
        success: false,
        message: "At least 5 images are required",
      });
    }

    const images = files.map((file) => ({
      url: file.path.replace(/\\/g, "/"),
      source: "pc",
    }));
    const embeddings = [];
    // 🔥 STEP 2: GENERATE EMBEDDINGS
    // const embeddings = [];
    for (let file of files) {
      try {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(file.path));

        const response = await axios.post(
          "http://localhost:8000/embed",
          formData,
          { headers: formData.getHeaders() },
        );

        console.log("Embedding response:", response.data);

        if (response.data.success && response.data.vector) {
          embeddings.push({
            vector: response.data.vector,
            source: "pc",
          });
          successCount++;
        } else {
          failCount++;
          console.log(`❌ Face not found in: ${file.path}`);
        }
      } catch (err) {
        console.log("Embedding error:", err.message);
      }
    }

    if (embeddings.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Not enough valid face embeddings. Try better images.",
      });
    }

let student;

try {
  student = await Student.create({
    name,
    class: classId,
    rollNumber: Number(rollNumber),
    registrationNumber: registrationNumber.trim(),
    images,
    embeddings,
  });
} catch (dbErr) {
  return res.status(500).json({
    success: false,
    message: dbErr.message,
  });
}
    console.log("FINAL EMBEDDINGS COUNT:", embeddings.length);
    return res.status(201).json({
      success: true,
      message: "Student created successfully with embeddings",
      data: student,
    });
  } catch (err) {
    console.error("CREATE STUDENT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await Student.countDocuments();

    const students = await Student.find()
      .populate("class")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Students fetched",
      data: {
        students,
        pagination: {
          total,
          page,
          limit,
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

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 🔥 DELETE IMAGE FILE IF EXISTS
    if (student.image?.url) {
      const filePath = path.join(process.cwd(), student.image.url);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("⚠ File delete error:", err.message);
        } else {
          console.log("🗑 Image deleted:", filePath);
        }
      });
    }

    // 🔥 DELETE STUDENT FROM DB
    await Student.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Student and image deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const updateStudent = async (req, res) => {
  try {
    const { name, class: classId, rollNumber, registrationNumber } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (classId) updateData.class = classId;
    if (rollNumber) updateData.rollNumber = Number(rollNumber);
    if (registrationNumber)
      updateData.registrationNumber = registrationNumber.trim();

    // 🔥 NEW: multiple images update
    if (req.files && req.files.length > 0) {
      // delete old images
      if (student.images?.length > 0) {
        student.images.forEach((img) => {
          const oldPath = path.join(process.cwd(), img.url);

          fs.unlink(oldPath, (err) => {
            if (err) console.log("⚠ Delete error:", err.message);
          });
        });
      }

      updateData.images = req.files.map((file) => ({
        url: file.path.replace(/\\/g, "/"),
        source: "pc",
      }));
    }

    const updated = await Student.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("class");

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getStudentsByClass = async(req,res)=>{
  try{
    const { classId } = req.params;
    const students = await Student.find({ class: classId }).populate("class");
    return res.status(200).json({
      success: true,
      message: "Students fetched",
      data: students,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}