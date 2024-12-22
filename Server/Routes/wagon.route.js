import express from "express";
import { assignWagons, updateHourlyProgress, getProgressByRakeNo, reasons, generateReport } from "../Controllers/wagon.controller.js";
import { isAuthenticated } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.route("/assignWagons").post(assignWagons);
router.route("/updateHourlyProgress").put(updateHourlyProgress);
router.route("/getProgress/:rakeNo").get(getProgressByRakeNo);
router.route("/reasons").get(reasons);
router.route("/report-1").post(generateReport);

export default router;
