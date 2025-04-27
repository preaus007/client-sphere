import { z } from "zod";
import catchErrors from "../utils/catchErrors";
import { forgotPassword } from "../services/user.service";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";
import { APP_ORIGIN } from "../constants/env";
import { OK } from "../constants/http";
import sendMail from "../utils/nodemailer";
import prisma from "../config/db";
import { hashPassword } from "../utils/hash";

const emailSchema = z.object({
  email: z.string().trim().email().max(255).nonempty(),
  userAgent: z.string().optional(),
});

export const forgotPasswordHandler = catchErrors(async (req, res) => {
  const request = emailSchema.parse(req.body);

  const { email } = req.body;

  const user = await prisma.freelancer.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found!");
  }

  const url = await forgotPassword({ ...request, user });

  res.status(OK).json({
    message: "Reset link sent to your mail",
    reset_link: url,
  });
});

export const resetPasswordHandler = catchErrors(async (req, res) => {
  const { token, password } = req.body;

  const verification = await prisma.verification.findFirst({
    where: { verificationToken: token, type: "password_reset" },
  });

  console.log(verification);

  if (!verification) {
    throw new BadRequestError("Invalid or expired token");
  }

  // Hash the password (don't skip this step!)
  const hashedPassword = await hashPassword(password);

  await prisma.freelancer.update({
    where: { id: verification.freelancerID },
    data: { password: hashedPassword },
  });

  await prisma.verification.delete({
    where: { id: verification.id },
  });

  res.status(OK).json({ message: "Password reset successful" });
});
