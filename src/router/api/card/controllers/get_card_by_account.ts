import { Request, Response } from "express";
import CardSchema from "@/models/card";

export const getCardByAccount = async (req: Request, res: Response) => {
  const { accountNumber } = req.params;
  console.log("accountNumber", accountNumber);

  try {
    const data = await CardSchema.find({ accountNumber });
    return res
      .status(200)
      .json({ status: "ok", data: data?.map((x) => x?.doc()) });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
