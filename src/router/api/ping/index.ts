import express from "express";
import { env } from "@/helpers";

export const PingRouter = express.Router();

PingRouter.route("/ping").get((_, res) => {
  res.json({ data: "pong", env: env("DB_URL") });
});
