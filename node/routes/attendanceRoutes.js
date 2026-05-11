import express from "express";
import multer from "multer";

import {
  startSession,
  markAttendance,
  stopSession,
} from "../controllers/attendanceController.js";

const router = express.Router();


// 🔥 MULTER SETUP
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


// ===============================
// 📌 ROUTES
// ===============================

// ✅ 1. START SESSION
router.post("/start", startSession);


// ✅ 2. MARK ATTENDANCE (with image)
router.post(
  "/mark",
  upload.single("image"),
  markAttendance
);


// ✅ 3. STOP SESSION
router.post("/stop", stopSession);


export default router;