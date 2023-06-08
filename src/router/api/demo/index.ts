import express from "express";
import { validate, verifyToken } from "@/middleware";
import { createRateDto, updateRateDto } from "./dto";
import { createRate } from "./controllers/create_rate";
import { updateRate } from "./controllers/update_rate";

const ROUTER = {
  create: "/rate",
  update: "/rate",
};

export const RateRouter = express.Router();

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
