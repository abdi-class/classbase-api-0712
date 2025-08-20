import { Router } from "express";
import BlogController from "../controllers/blog.controller";
import { verifyToken } from "../middleware/verifyToken";
import { verifyAuthor } from "../middleware/verifyRole";

class BlogRouter {
  private route: Router;
  private blogController: BlogController;

  constructor() {
    this.route = Router();
    this.blogController = new BlogController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      "/create",
      verifyToken,
      verifyAuthor,
      this.blogController.createBlog
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default BlogRouter;
