import { validate, verifyToken } from "@/middleware";
import express from "express";

import { createTransaction } from "./controllers/create_transaction";
import { createRateDto } from "./dto";

const ROUTER = {
  create: "/transaction",
  update: "/transaction",
};

export const TransactionRouter = express.Router();

TransactionRouter.route(ROUTER.create).post([
  verifyToken,
  validate(createRateDto),
  createTransaction,
]);
