import { Request, Response } from "express";
import AccountSchema from "@/models/account";

export const updateAccount = async (req: Request, res: Response) => {
  const { accountName, accountNumber, iban, swiftCode, isMain } =
    req.body as any;

  const { id } = req.params;

  try {
    const newData = await AccountSchema.findByIdAndUpdate(
      id,
      {
        $set: {
          accountName,
          accountNumber,
          iban,
          swiftCode,
          isMain,
        },
      },
      { new: true }
    );
    return res.status(200).json({ status: "ok", data: newData?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
