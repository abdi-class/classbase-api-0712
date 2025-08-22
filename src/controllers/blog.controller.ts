import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";

class BlogController {
  public async createBlog(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
      const { title, thumbnail, categoryId, content } = req.body;
      const newBlog = await prisma.blogs.create({
        data: {
          title,
          thumbnail,
          categoryId,
          content,
          accountId:parseInt(res.locals.decript.id)
        },
      });

      res.status(200).send({
        success: true,
        message: "Blog added successfully",
        newBlog,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default BlogController;
