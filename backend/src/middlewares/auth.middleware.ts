import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { Request, Response, NextFunction } from "express";
import catchErrors from "../utils/catchErrors";
import { JWT_SECRET } from "../constants/env";
import { UnauthorizedError } from "../utils/errors";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  // add more fields if needed, just not the password
}

declare module "express" {
  interface Request {
    user?: AuthenticatedUser;
  }
}

export const protectRoute = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
      throw new UnauthorizedError("Unauthorized - No access token provided");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET as string) as { id: string };
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        throw new UnauthorizedError("Access token expired");
      }
      throw new UnauthorizedError("Unauthorized - Invalid access token");
    }

    const user = await prisma.freelancer.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.user = user;
    next();
  }
);
