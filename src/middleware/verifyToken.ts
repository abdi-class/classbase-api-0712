import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw { code: 401, message: "Unauthorized Token" };
    }

    const checkToken = verify(token, "secret");

    res.locals.decript = checkToken;
    next(); // forward to controller
  } catch (error: any) {
    console.log("error token", error.message);
    if (error.message === "jwt expired") {
      next({ success: false, code: 400, message: "Your token is expired" });
    } else {
      next(error);
    }
  }
};
