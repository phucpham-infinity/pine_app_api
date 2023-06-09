import { Request, Response } from "express";
import AccountSchema from "@/models/account";

export const createAccount = async (req: Request, res: Response) => {
  const { accountName, accountNumber, iban, swiftCode, isMain } =
    req.body as any;
  const { _id } = req.user || {};

  try {
    const newData = new AccountSchema({
      accountName,
      accountNumber,
      iban,
      swiftCode,
      isMain,
      userId: _id,
    });
    const dataNew = await newData.save();
    return res.status(200).json({ status: "ok", data: dataNew.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
