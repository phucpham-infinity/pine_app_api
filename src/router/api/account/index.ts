import express from "express";
import { validate, verifyToken } from "@/middleware";
import { createAccountDto, updateAccountDto } from "./dto";
import { createAccount } from "./controllers/create_account";
import { updateAccount } from "./controllers/update_account";
import { removeAccount } from "./controllers/remove_account";

const ROUTER = {
  create: "/account",
  update: "/account/:id",
  remove: "/account/:id",
};

export const AccountRouter = express.Router();

AccountRouter.route(ROUTER.create).post([
  verifyToken,
  validate(createAccountDto),
  createAccount,
]);

AccountRouter.route(ROUTER.update).put([
  verifyToken,
  validate(updateAccountDto),
  updateAccount,
]);

AccountRouter.route(ROUTER.remove).delete([verifyToken, removeAccount]);
