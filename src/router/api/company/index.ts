import express from "express";
import { validate, verifyToken } from "@/middleware";

import { createCompanyDto } from "./dto";
import { createCompany } from "./controllers/create_company";
import { joinCompany } from "./controllers/join_company";

const ROUTER = {
  create: "/company",
  join: "/company/join",
};

export const CompanyRouter = express.Router();

CompanyRouter.route(ROUTER.create).post([
  verifyToken,
  validate(createCompanyDto),
  createCompany,
]);

CompanyRouter.route(ROUTER.join).post([verifyToken, joinCompany]);
