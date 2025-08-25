import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hashPassword";
import { compare } from "bcrypt";
import { createToken } from "../utils/createToken";
import { verify } from "jsonwebtoken";
import { transport } from "../config/nodemailer";
import { cloudinaryUpload } from "../config/cloudinary";
import { loginService, registerService } from "../service/auth.service";
import logger from "../utils/logger";

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      await registerService(req.body);

      res.status(200).send({
        success: true,
        message: "Registration success",
      });
    } catch (error) {
      next(error);
    }
  }
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info(
        `${req.method} ${req.path}: incoming data ${JSON.stringify(req.body)}`
      );
      const { email, role, token } = await loginService(req.body);

      res.status(200).send({
        success: true,
        account: {
          email,
          role,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  public async keepLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const account = await prisma.accounts.findUnique({
        where: { id: parseInt(res.locals.decript.id) },
      });

      if (!account) {
        throw { success: false, message: "Account is not exist" };
      }

      const newToken = createToken(account, "24h");
      res.status(200).send({
        success: true,
        account: {
          email: account.email,
          role: account.role,
          token: newToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const verifyAccount = await prisma.accounts.update({
        data: { isVerified: true },
        where: {
          id: parseInt(res.locals.decript.id),
        },
      });

      res.status(200).send({
        success: true,
        message: "Verify account success",
      });
    } catch (error) {
      next(error);
    }
  }

  public async changeProfileImg(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw { code: 404, message: "No exist file" };
      }
      const upload = await cloudinaryUpload(req.file);
      const update = await prisma.accounts.update({
        where: { id: parseInt(res.locals.decript.id) },
        data: { profile_img: upload.secure_url },
      });

      res
        .status(200)
        .send({ success: true, message: "Change image profile success" });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
