import { Request, Response } from "express";
import RateSchema from "@/models/rate";

export const getAllRate = async (req: Request, res: Response) => {
  try {
    const data = await RateSchema.find();
    return res.status(200).json({ status: "ok", data: data });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
