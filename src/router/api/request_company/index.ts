import express from "express";
import { validate, verifyToken } from "@/middleware";

import { createRequetCompanyDto } from "./dto";
import { createRequestCompany } from "./controllers/create_request_company";
import { approvalRequestCompany } from "./controllers/approval_request_company";
import { getAllRequestCompany } from "./controllers/get_all_request_company";
const ROUTER = {
  create: "/request-company",
  approval: "/request-company/approval/:email",
  getAll: "/request-company",
};

export const RequestCompanyRouter = express.Router();

RequestCompanyRouter.route(ROUTER.create).post([
  verifyToken,
  validate(createRequetCompanyDto),
  createRequestCompany,
]);

RequestCompanyRouter.route(ROUTER.approval).post([
  verifyToken,
  approvalRequestCompany,
]);

RequestCompanyRouter.route(ROUTER.getAll).get([
  verifyToken,
  getAllRequestCompany,
]);
