import { validate, verifyToken } from "@/middleware";
import express from "express";

import { createTransaction } from "./controllers/create_transaction";
import { creatDepositTransaction } from "./controllers/deposit";
import { creatInvoiceTransaction } from "./controllers/invoice";
import { createRateDto } from "./dto";

const ROUTER = {
  create: "/transaction",
  update: "/transaction",
  deposit: "/transaction/deposit",
  invoice: "/transaction/invoice",
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

TransactionRouter.route(ROUTER.invoice).post([
  verifyToken,
  validate(createRateDto),
  creatInvoiceTransaction,
]);
