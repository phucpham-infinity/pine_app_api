import { Request, Response } from "express";
import RateSchema from "@/models/rate";
import { isEmpty } from "lodash";

export const updateRate = async (req: Request, res: Response) => {
  const { fee, transactions, atmDeposits, addOns, books } = req.body as any;
  const { name } = req.params;
  try {
    const newRate = await RateSchema.findOneAndUpdate(
      { name },
      {
        $set: {
          fee,
          transactions,
          atmDeposits,
          addOns,
          books,
        },
      },
      { new: true }
    );
    if (isEmpty(newRate))
      return res.status(400).json({ status: 400, error: "Rete not found!" });
    return res.status(200).json({ status: "ok", data: newRate?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
