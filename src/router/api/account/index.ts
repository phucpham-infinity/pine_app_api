import express from "express";
import { validate, verifyToken } from "@/middleware";
import { createAccountDto } from "./dto";
import { createAccount } from "./controllers/create_account";

const ROUTER = {
  create: "/account",
  update: "/account",
};

export const AccountRouter = express.Router();

AccountRouter.route(ROUTER.create).post([
  verifyToken,
  validate(createAccountDto),
  createAccount,
]);
