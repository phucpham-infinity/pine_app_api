import { Request, Response } from "express";
import TransactionSchema from "@/models/transaction";

export const createTransaction = async (req: Request, res: Response) => {
  const { accountId, type, amount, category, description, cardNumber } =
    req.body as any;
  const { _id } = req?.user || {};

  try {
    const newData = new TransactionSchema({
      createdBy: _id,
      accountId,
      amount,
      category,
      description,
      type,
      cardNumber,
      date: new Date(),
    });
    const dataNew = await newData.save();
    return res.status(200).json({ status: "ok", data: dataNew.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
