import { Request, Response } from "express";
import CardSchema from "@/models/card";

export const createCard = async (req: Request, res: Response) => {
  const { cardType, nicname, status, cardNumber, accountNumber, isMain } =
    req.body as any;
  try {
    const newData = new CardSchema({
      accountNumber,
      cardNumber,
      cardType,
      nicname,
      status,
      isMain,
    });
    const dataNew = await newData.save();
    return res.status(200).json({ status: "ok", data: dataNew.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
