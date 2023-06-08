import express, { Request, Response } from "express";

const ROUTER = {
  create: "/request-delivery",
  update: "/request-delivery",
};

export const RequestDeliveryRouter = express.Router();

RequestDeliveryRouter.route(ROUTER.create).post([
  (req: Request, res: Response) => {
    return res.status(200).json({ status: "ok", data: req.body });
  },
]);
