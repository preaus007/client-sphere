import prisma from "../config/db";
import { APP_ORIGIN } from "../constants/env";
import { AuthenticatedUser } from "../middlewares/auth.middleware";
import { NotFoundError } from "../utils/errors";
import sendMail from "../utils/nodemailer";

type ForgotPassParams = {
  email: string;
  user: AuthenticatedUser;
  userAgent?: string;
};

export const forgotPassword = async (data: ForgotPassParams) => {
  const { email, user, userAgent } = data;

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.verification.create({
    data: {
      freelancerID: user.id,
      type: "password_reset",
      verificationToken: code,
      verificationTokenExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  const url = `${APP_ORIGIN}/api/user/reset/${code}`;

  //   await sendMail({
  //     to: email,
  //     subject: "Reset your password",
  //     html: `<p>Click <a href="${url}">here</a> to reset your password</p>`,
  //   });

  return url;
};
