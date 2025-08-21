import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyToken";
import {
  loginValidation,
  regisValidation,
} from "../middleware/validation/auth";
import { uploaderMemory } from "../middleware/uploader";

class AuthRouter {
  private route: Router;
  private authController: AuthController;

  constructor() {
    this.route = Router();
    this.authController = new AuthController();
    this.initilizeRoute();
  }

  private initilizeRoute(): void {
    this.route.post("/signup", regisValidation, this.authController.register);
    this.route.post("/signin", loginValidation, this.authController.login);
    this.route.get("/keep", verifyToken, this.authController.keepLogin);

    this.route.patch("/verify", verifyToken, this.authController.verify);

    this.route.patch(
      "/profile-img",
      verifyToken,
      uploaderMemory().single("img"),
      this.authController.changeProfileImg
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default AuthRouter;
