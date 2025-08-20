import { NextFunction, Request, Response } from "express";

class BlogController {
  public async createBlog(req: Request, res: Response, next: NextFunction) {
    try {
      //
    } catch (error) {
      next(error);
    }
  }
}

export default BlogController;
