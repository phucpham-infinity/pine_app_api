import { Request, Response } from "express";
import RateSchema from "@/models/rate";

export const createRate = async (req: Request, res: Response) => {
  const { name, fee, transactions, atmDeposits, addOns, books } =
    req.body as any;
  try {
    const newData = new RateSchema({
      name,
      fee,
      transactions,
      atmDeposits,
      addOns,
      books,
    });
    const dataNew = await newData.save();
    return res.status(200).json({ status: "ok", data: dataNew.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
