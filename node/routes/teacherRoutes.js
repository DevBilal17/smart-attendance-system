import express from "express";
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherById,
  getTeacherProfile,
  getTeacherAssignments,
} from "../controllers/teacherController.js";

const router = express.Router();

router.get("/", getTeachers);
router.post("/", createTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);
router.get("/:id", getTeacherById);
router.get("/profile/:id", getTeacherProfile);
router.get("/assignments/:id", getTeacherAssignments);

export default router;