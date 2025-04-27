import catchErrors from "../utils/catchErrors";
// import { loginSchema, registerSchema } from "../schemas/auth.schema";

import { z } from "zod";
import { createAccount, loginUser } from "../services/auth.service";

import { CREATED, OK } from "../constants/http";

const loginSchema = z.object({
  email: z.string().trim().email().max(255).nonempty(),
  password: z.string().min(6).max(255),
});

const registerSchema = loginSchema
  .extend({
    name: z.string().trim().min(3).max(50),
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  });

export const registerHandler = catchErrors(async (req, res) => {
  // validate request with zod
  const body = req.body;

  const request = registerSchema.parse({
    ...body,
    userAgent: req.headers["user-agent"],
  });

  // call services
  const user = await createAccount(request);

  // return res
  return res
    .status(CREATED)
    .json({ message: "User created sucessfully!", user });
});

export const loginHandler = catchErrors(async (req, res) => {
  // validate request with zod
  const body = req.body;

  const request = loginSchema.parse({
    ...body,
    userAgent: req.headers["user-agent"],
  });

  // call services
  const token = await loginUser(request);

  // return res
  return res
    .cookie("token", token, {
      httpOnly: true, // prevent XSS attacks, cross site scripting attack
      sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .status(OK)
    .json({ message: "Logged in successful" });
});

export const logoutHandler = catchErrors(async (req, res) => {
  res.clearCookie("token");
  res.status(OK).json({ message: "Logged out successfully" });
});

export const profileHandler = catchErrors(async (req, res) => {
  const { password, ...data } = await JSON.parse(JSON.stringify(req.user));
  res.status(OK).json(data);
});

// export const verifyEmailHandler = catchErrors(async (req, res) => {
//   const verificationCode = verificationCodeSchema.parse(req.params.code);

//   await verifyEmail(verificationCode);

//   return res.status(OK).json({ message: "Email was successfully verified" });
// });

// export const sendPasswordResetHandler = catchErrors(async (req, res) => {
//   const email = emailSchema.parse(req.body.email);

//   await sendPasswordResetEmail(email);

//   return res.status(OK).json({ message: "Password reset email sent" });
// });

// export const resetPasswordHandler = catchErrors(async (req, res) => {
//   const request = resetPasswordSchema.parse(req.body);

//   await resetPassword(request);

//   return clearAuthCookies(res)
//     .status(OK)
//     .json({ message: "Password was reset successfully" });
// });
