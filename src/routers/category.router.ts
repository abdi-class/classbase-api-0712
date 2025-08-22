import { Router } from "express";
import CategoryController from "../controllers/category.controller";

class CategoryRouter {
  private route: Router;
  private categoryController: CategoryController;

  constructor() {
    this.route = Router();
    this.categoryController = new CategoryController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.get("/category", this.categoryController.getAllCategory);
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default CategoryRouter;
