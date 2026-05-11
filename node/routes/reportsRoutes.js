import express from "express";
import {
  getTeacherReport,
  getAdminReport,
  exportTeacherReportPDF,
  exportAdminReportPDF,
  getClassReport,
} from "../controllers/attendanceController.js";

const router = express.Router();

// 👨‍🏫 TEACHER REPORT
router.get("/teacher/:teacherId", getTeacherReport);

// 🧑‍💼 ADMIN REPORT
router.get("/admin", getAdminReport);

router.get("/class/:classId/subject/:subjectId", getClassReport);

router.get(
  "/teacher/:teacherId/pdf",
  exportTeacherReportPDF
);


// 🧑‍💼 ADMIN REPORT (full system + optional filters)
router.get(
  "/admin/pdf",
  exportAdminReportPDF
);

export default router;