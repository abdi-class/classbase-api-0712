import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyToken";

class AuthRouter {
  private route: Router;
  private authController: AuthController;

  constructor() {
    this.route = Router();
    this.authController = new AuthController();
    this.initilizeRoute();
  }

  private initilizeRoute(): void {
    this.route.post("/signup", this.authController.register);
    this.route.post("/signin", this.authController.login);
    this.route.get("/keep", verifyToken, this.authController.keepLogin);
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default AuthRouter;
