import express from "express";
import multer from "multer";
import path from "path";
import {
  createStudent,
  getStudents,
  deleteStudent,
  updateStudent,
  getStudentsByClass,
} from "../controllers/studentController.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};
// multer setup
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per image
  },
});

// 🔥 CHANGE: single file instead of array
router.post("/", upload.array("images", 10), createStudent);

router.get("/", getStudents);
router.delete("/:id", deleteStudent);
router.put("/:id", upload.array("images", 10), updateStudent);

router.get("/class/:classId", getStudentsByClass)
export default router;