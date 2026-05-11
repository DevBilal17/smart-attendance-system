import express from "express";
import { createClass, getClasses, deleteClass, updateClass } from "../controllers/classController.js";

const router = express.Router();

router.post("/", createClass);
router.get("/", getClasses);
router.delete("/:id", deleteClass);
router.put("/:id", updateClass);

export default router;