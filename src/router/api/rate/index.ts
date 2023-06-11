import express from "express";
import { validate, verifyToken } from "@/middleware";
import { createRateDto, updateRateDto } from "./dto";
import { createRate } from "./controllers/create_rate";
import { updateRate } from "./controllers/update_rate";
import { getAllRate } from "./controllers/get_all_rate";
import { joinRate } from "./controllers/join_rate";
import { getRateByName } from "./controllers/get_rate";

const ROUTER = {
  create: "/rate",
  update: "/rate/:name",
  getAll: "/rate",
  getByName: "/rate/:name",
  join: "/rate/join",
};

export const RateRouter = express.Router();

RateRouter.route(ROUTER.getAll).get([verifyToken, getAllRate]);
RateRouter.route(ROUTER.getByName).get([verifyToken, getRateByName]);

RateRouter.route(ROUTER.join).post([verifyToken, joinRate]);

RateRouter.route(ROUTER.create).post([
  verifyToken,
  validate(createRateDto),
  createRate,
]);

RateRouter.route(ROUTER.update).put([
  verifyToken,
  validate(updateRateDto),
  updateRate,
]);
