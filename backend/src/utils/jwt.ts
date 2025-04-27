import jwt from "jsonwebtoken";
import { Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "$ecret";

export const generateTokenAndSetCookie = (res: Response, id: string) => {
  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET);
