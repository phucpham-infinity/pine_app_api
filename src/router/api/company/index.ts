import express from "express";
import { validate, verifyToken } from "@/middleware";

import { createCompanyDto, updateCompanyDto } from "./dto";
import { createCompany } from "./controllers/create_company";
import { joinCompany } from "./controllers/join_company";
import { updateCompany } from "./controllers/update_company";
import { getCompanyByName } from "./controllers/get_company_by_name";

const ROUTER = {
  create: "/company",
  update: "/company/:name",
  getByName: "/company/:name",
  join: "/company/join",
};

export const CompanyRouter = express.Router();

CompanyRouter.route(ROUTER.create).post([
  verifyToken,
  validate(createCompanyDto),
  createCompany,
]);

CompanyRouter.route(ROUTER.getByName).get([verifyToken, getCompanyByName]);

CompanyRouter.route(ROUTER.join).post([verifyToken, joinCompany]);
CompanyRouter.route(ROUTER.update).put([
  verifyToken,
  validate(updateCompanyDto),
  updateCompany,
]);
