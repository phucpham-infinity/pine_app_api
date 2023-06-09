import { validate, verifyToken } from "@/middleware";
import express from "express";

import { createCard } from "./controllers/create_card";
import { createRateDto } from "./dto";

const ROUTER = {
  create: "/card",
  update: "/card",
};

export const CardRouter = express.Router();

CardRouter.route(ROUTER.create).post([
  verifyToken,
  validate(createRateDto),
  createCard,
]);
