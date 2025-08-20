import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hashPassword";
import { compare } from "bcrypt";
import { createToken } from "../utils/createToken";
import { verify } from "jsonwebtoken";

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.accounts.create({
        data: { ...req.body, password: await hashPassword(req.body.password) },
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
}

export default AuthController;
