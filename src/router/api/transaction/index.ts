import { validate, verifyToken } from "@/middleware";
import express from "express";

import { createTransaction } from "./controllers/create_transaction";
import { creatDepositTransaction } from "./controllers/deposit";
import { createRateDto } from "./dto";

const ROUTER = {
  create: "/transaction",
  update: "/transaction",
  deposit: "/transaction/deposit",
};

export const TransactionRouter = express.Router();

TransactionRouter.route(ROUTER.create).post([
  verifyToken,
  validate(createRateDto),
  createTransaction,
]);

TransactionRouter.route(ROUTER.deposit).post([
  verifyToken,
  validate(createRateDto),
  creatDepositTransaction,
]);
