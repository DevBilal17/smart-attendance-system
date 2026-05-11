import express from "express";
import { getDashboardChart, getDashboardStats } from "../controllers/dashboardController.js";


const router = express.Router();


router.get("/stats",getDashboardStats)

router.get("/chart",getDashboardChart) 

export default router;