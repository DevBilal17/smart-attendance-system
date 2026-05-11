import express from "express";
import {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

router.post("/", createSubject);
router.get("/", getSubjects);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

export default router;