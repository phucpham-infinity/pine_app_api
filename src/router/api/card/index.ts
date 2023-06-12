import { validate, verifyToken } from "@/middleware";
import express from "express";

import { createCard } from "./controllers/create_card";
import { getCardById } from "./controllers/get_card_by_id";
import { createRateDto } from "./dto";

const ROUTER = {
  create: "/card",
  update: "/card",
  getById: "/card/:id",
};

export const CardRouter = express.Router();

CardRouter.route(ROUTER.create).post([
  verifyToken,
  validate(createRateDto),
  createCard,
]);

CardRouter.route(ROUTER.getById).get([verifyToken, getCardById]);
