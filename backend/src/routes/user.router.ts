import { Router } from "express";
import {
  forgotPasswordHandler,
  resetPasswordHandler,
} from "../controllers/user.controller";

const router = Router();

router.post("/", forgotPasswordHandler);
router.post("/reset", resetPasswordHandler);

export default router;
