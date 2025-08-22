import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";

class CategoryController {
  public async getAllCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await prisma.categories.findMany();

      res.status(200).send(category);
    } catch (error) {
      next(error);
    }
  }
}

export default CategoryController;
