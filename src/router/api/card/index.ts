import { validate, verifyToken } from "@/middleware";
import express from "express";

import { createCard } from "./controllers/create_card";
import { getCardById } from "./controllers/get_card_by_id";
import { getAllCard } from "./controllers/get_all_card";
import { getCardByAccount } from "./controllers/get_card_by_account";

import { createRateDto } from "./dto";

const ROUTER = {
  all: "/card",
  create: "/card",
  update: "/card",
  getById: "/card/:id",
  getByAccount: "/card/account/:accountNumber",
};

export const CardRouter = express.Router();

CardRouter.route(ROUTER.create).post([
  verifyToken,
  validate(createRateDto),
  createCard,
]);

CardRouter.route(ROUTER.getById).get([verifyToken, getCardById]);
CardRouter.route(ROUTER.all).get([verifyToken, getAllCard]);
CardRouter.route(ROUTER.getByAccount).get([verifyToken, getCardByAccount]);
