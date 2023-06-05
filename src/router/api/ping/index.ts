import express from "express";

export const PingRouter = express.Router();

PingRouter.route("/ping").get((_, res) => {
  res.send("pong");
});
