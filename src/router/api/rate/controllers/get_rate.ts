import { Request, Response } from "express";
import RateSchema from "@/models/rate";

export const getRateByName = async (req: Request, res: Response) => {
  const { name } = req.params;

  try {
    const data = await RateSchema.findOne({ name });
    if (!data)
      return res.status(400).json({ status: 400, error: "Rate not found!" });
    return res.status(200).json({ status: "ok", data: data?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
