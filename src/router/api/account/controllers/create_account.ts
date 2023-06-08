import { Request, Response } from "express";
import AccountSchema from "@/models/account";

export const createAccount = async (req: Request, res: Response) => {
  const { accountName, accountNumber, iban, swiftCode } = req.body as any;
  const { user } = req || {};

  try {
    const newData = new AccountSchema({
      accountName,
      accountNumber,
      iban,
      swiftCode,
      phone: user.phone,
    });
    const dataNew = await newData.save();
    return res.status(200).json({ status: "ok", data: dataNew.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
