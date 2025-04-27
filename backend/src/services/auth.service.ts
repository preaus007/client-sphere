import prisma from "../config/db";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { UNAUTHORIZED } from "../constants/http";
import VerificationCodeType from "../constants/verificationCodeType";
import {
  ConflictError,
  InvalidCredentials,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";
import { comparePassword, hashPassword } from "../utils/hash";
import jwt from "jsonwebtoken";

type CreateAccountParams = {
  name: string;
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  const { name, email, password, userAgent } = data;

  const existingUser = await prisma.freelancer.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError("User already exists.");
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.freelancer.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.verification.create({
    data: {
      freelancerID: newUser.id,
      type: VerificationCodeType.EmailVerification,
      verificationToken: code,
      verificationTokenExpiresAt: expiry,
    },
  });

  return newUser;
};

type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};
export const loginUser = async (data: LoginParams) => {
  const { email, password, userAgent } = data;
  const user = await prisma.freelancer.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    throw new InvalidCredentials("Invalid email or password");
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

// export const verifyEmail = async (code: string) => {
//   const validCode = await VerificationCodeModel.findOne({
//     _id: code,
//     type: VerificationCodeType.EmailVerification,
//     expiresAt: { $gt: new Date() },
//   });
//   appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

//   const updatedUser = await UserModel.findByIdAndUpdate(
//     validCode.userId,
//     {
//       verified: true,
//     },
//     { new: true }
//   );
//   appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");

//   await validCode.deleteOne();

//   return {
//     user: updatedUser.omitPassword(),
//   };
// };

// export const refreshUserAccessToken = async (refreshToken: string) => {
//   const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
//     secret: refreshTokenSignOptions.secret,
//   });
//   appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

//   const session = await SessionModel.findById(payload.sessionId);
//   const now = Date.now();
//   appAssert(
//     session && session.expiresAt.getTime() > now,
//     UNAUTHORIZED,
//     "Session expired"
//   );

//   // refresh the session if it expires in the next 24hrs
//   const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
//   if (sessionNeedsRefresh) {
//     session.expiresAt = thirtyDaysFromNow();
//     await session.save();
//   }

//   const newRefreshToken = sessionNeedsRefresh
//     ? signToken(
//         {
//           sessionId: session._id,
//         },
//         refreshTokenSignOptions
//       )
//     : undefined;

//   const accessToken = signToken({
//     userId: session.userId,
//     sessionId: session._id,
//   });

//   return {
//     accessToken,
//     newRefreshToken,
//   };
// };

// export const sendPasswordResetEmail = async (email: string) => {
//   // Catch any errors that were thrown and log them (but always return a success)
//   // This will prevent leaking sensitive data back to the client (e.g. user not found, email not sent).
//   try {
//     const user = await UserModel.findOne({ email });
//     appAssert(user, NOT_FOUND, "User not found");

//     // check for max password reset requests (2 emails in 5min)
//     const fiveMinAgo = fiveMinutesAgo();
//     const count = await VerificationCodeModel.countDocuments({
//       userId: user._id,
//       type: VerificationCodeType.PasswordReset,
//       createdAt: { $gt: fiveMinAgo },
//     });
//     appAssert(
//       count <= 1,
//       TOO_MANY_REQUESTS,
//       "Too many requests, please try again later"
//     );

//     const expiresAt = oneHourFromNow();
//     const verificationCode = await VerificationCodeModel.create({
//       userId: user._id,
//       type: VerificationCodeType.PasswordReset,
//       expiresAt,
//     });

//     const url = `${APP_ORIGIN}/password/reset?code=${
//       verificationCode._id
//     }&exp=${expiresAt.getTime()}`;

//     const { data, error } = await sendMail({
//       to: email,
//       ...getPasswordResetTemplate(url),
//     });

//     appAssert(
//       data?.id,
//       INTERNAL_SERVER_ERROR,
//       `${error?.name} - ${error?.message}`
//     );
//     return {
//       url,
//       emailId: data.id,
//     };
//   } catch (error: any) {
//     console.log("SendPasswordResetError:", error.message);
//     return {};
//   }
// };

// type ResetPasswordParams = {
//   password: string;
//   verificationCode: string;
// };

// export const resetPassword = async ({
//   verificationCode,
//   password,
// }: ResetPasswordParams) => {
//   const validCode = await VerificationCodeModel.findOne({
//     _id: verificationCode,
//     type: VerificationCodeType.PasswordReset,
//     expiresAt: { $gt: new Date() },
//   });
//   appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

//   const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
//     password: await hashValue(password),
//   });
//   appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password");

//   await validCode.deleteOne();

//   // delete all sessions
//   await SessionModel.deleteMany({ userId: validCode.userId });

//   return { user: updatedUser.omitPassword() };
// };
