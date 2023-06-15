import { validate, verifyToken } from "@/middleware";
import express from "express";

import { createTransaction } from "./controllers/create_transaction";
import { createDepositTransaction } from "./controllers/deposit";
import { createInvoiceTransaction } from "./controllers/invoice";
import { createTransferTransaction } from "./controllers/transfer";
import { createRateDto } from "./dto";

const ROUTER = {
  create: "/transaction",
  update: "/transaction",
  deposit: "/transaction/deposit",
  invoice: "/transaction/invoice",
  transfer: "/transaction/transfer",
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
  createDepositTransaction,
]);

TransactionRouter.route(ROUTER.invoice).post([
  verifyToken,
  validate(createRateDto),
  createInvoiceTransaction,
]);

TransactionRouter.route(ROUTER.transfer).post([
  verifyToken,
  validate(createRateDto),
  createTransferTransaction,
]);
