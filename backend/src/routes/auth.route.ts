import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  profileHandler,
  registerHandler,
} from "../controllers/auth.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/profile", protectRoute, profileHandler);
router.get("/logout", logoutHandler);

export default router;
