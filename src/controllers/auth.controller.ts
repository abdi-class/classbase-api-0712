import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hashPassword";
import { compare } from "bcrypt";
import { createToken } from "../utils/createToken";
import { verify } from "jsonwebtoken";
import { transport } from "../config/nodemailer";
import { cloudinaryUpload } from "../config/cloudinary";

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const account = await prisma.accounts.create({
        data: { ...req.body, password: await hashPassword(req.body.password) },
      });

      const token = createToken(account, "3m");

      await transport.sendMail({
        from: process.env.MAIL_SENDER,
        to: req.body.email,
        subject: "Registration success",
        html: `<div>
        <p>Your account is created, verify your email</p>
        <a href="${process.env.FE_URL}/verify/${token}" target="_blank">Verify Account</a>
        </div>`,
      });

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
      const account = await prisma.accounts.findUnique({
        where: {
          email: req.body.email,
        },
      });
      if (!account) {
        throw { success: false, message: "Account is not exist" };
      }

      // Validate password
      const comparePass = await compare(req.body.password, account.password);
      if (!comparePass) {
        throw { message: "Password wrong" };
      }

      const token = createToken(account, "24h");

      res.status(200).send({
        success: true,
        account: {
          email: account.email,
          role: account.role,
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
