import express from "express";
import { addRake, getAllRakes } from "../Controllers/form.controller.js";
import { isAuthenticated } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.route("/addRake").post(addRake);
router.route("/getAllRakes").get(getAllRakes);

export default router;
