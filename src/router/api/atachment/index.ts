import { validate, verifyToken } from "@/middleware";
import express from "express";
import { createAtachmentDto, updateAtachmentDto } from "./dto";

import { createAtachment } from "./controllers/create_atachment";
import { updateAtachment } from "./controllers/update_atachment";
import { removeAtachment } from "./controllers/remove_atachment";
import { getByCompany } from "./controllers/get_by_company";
const ROUTER = {
  create: "/atachment",
  update: "/atachment/:id",
  remove: "/atachment/:id",
  getByCompany: "/atachment/compnay/:id",
  getAll: "/atachment",
};

export const AtachmentRouter = express.Router();

AtachmentRouter.route(ROUTER.create).post([
  verifyToken,
  validate(createAtachmentDto),
  createAtachment,
]);

AtachmentRouter.route(ROUTER.update).post([
  verifyToken,
  validate(updateAtachmentDto),
  updateAtachment,
]);

AtachmentRouter.route(ROUTER.remove).delete([verifyToken, removeAtachment]);
AtachmentRouter.route(ROUTER.getByCompany).get([verifyToken, getByCompany]);
