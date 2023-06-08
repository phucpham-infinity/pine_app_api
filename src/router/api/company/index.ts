import express from "express";
import { validate } from "@/middleware";

import { createCompanyDto } from "./dto";
import { createCompany } from "./controllers/create_company";

const ROUTER = {
  register: "/company",
};

export const CompanyRouter = express.Router();

CompanyRouter.use(ROUTER.register, [validate(createCompanyDto)])
  .route(ROUTER.register)
  .post(createCompany);
