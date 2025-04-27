import { protectRoute } from "../middlewares/auth.middleware";
import authRoute from "./auth.route";
import userRouter from "./user.router";

import express from "express";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRouter);

export default router;
