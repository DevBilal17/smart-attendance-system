import express from "express";
import {
  createTimetable,
  getTimetables,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
} from "../controllers/timetableController.js";

const router = express.Router();

router.post("/", createTimetable);
router.get("/", getTimetables);
router.get("/:id", getTimetableById);
router.put("/:id", updateTimetable);
router.delete("/:id", deleteTimetable);

export default router;