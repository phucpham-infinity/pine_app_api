import express from "express";
import { validate, verifyToken } from "@/middleware";

import { createRequetCompanyDto } from "./dto";
import { createRequestAccount } from "./controllers/create_request";
import { approvalRequestAccount } from "./controllers/approval_request";
import { getAllRequestAccount } from "./controllers/get_all_request";

const ROUTER = {
  create: "/request-account",
  approval: "/request-account/approval",
  getAll: "/request-account",
};

export const RequestAccountRouter = express.Router();

RequestAccountRouter.route(ROUTER.create).post([
  verifyToken,
  validate(createRequetCompanyDto),
  createRequestAccount,
]);

RequestAccountRouter.route(ROUTER.approval).put([
  verifyToken,
  approvalRequestAccount,
]);

RequestAccountRouter.route(ROUTER.getAll).get([
  verifyToken,
  getAllRequestAccount,
]);
