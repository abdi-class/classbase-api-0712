import { compare } from "bcrypt";
import { transport } from "../config/nodemailer";
import { prisma } from "../config/prisma";
import { createAccount } from "../repositories/accounts.repository";
import { createToken } from "../utils/createToken";
import AppError from "../utils/AppError";

export const registerService = async (data: any) => {
  const account = await createAccount(data);

  const token = createToken(account, "3m");

  await transport.sendMail({
    from: process.env.MAIL_SENDER,
    to: data.email,
    subject: "Registration success",
    html: `<div>
            <p>Your account is created, verify your email</p>
            <a href="${process.env.FE_URL}/verify/${token}" target="_blank">Verify Account</a>
            </div>`,
  });

  return { account, token };
};

export const loginService = async (data: {
  email: string;
  password: string;
}) => {
  const account = await prisma.accounts.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!account) {
    throw new AppError("Account is not exist", 404);
  }

  // Validate password
  const comparePass = await compare(data.password, account.password);
  if (!comparePass) {
    throw new AppError("Password is wrong", 400);
  }

  const token = createToken(account, "24h");

  return { ...account, token };
};
