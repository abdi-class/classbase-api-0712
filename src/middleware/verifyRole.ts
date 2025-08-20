import { NextFunction, Request, Response } from "express";

export const verifyAuthor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (res.locals.decript.role !== "author") {
      throw { code: 401, message: "You not author" };
    }
    next();
  } catch (error) {
    next(error);
  }
};
