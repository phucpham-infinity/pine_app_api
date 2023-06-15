import { Request, Response } from "express";
import TransactionSchema from "@/models/transaction";
import AccountSchema from "@/models/account";
import { isNumber } from "lodash";

export const createDepositTransaction = async (req: Request, res: Response) => {
  const { accountId, amount, category, description, cardNumber } =
    req.body as any;
  const { _id } = req.user || {};
  try {
    const account = await AccountSchema.findById(accountId);

    if (!account)
      return res.status(400).json({ status: 400, error: "Account not found!" });

    if (!isNumber(+amount))
      return res.status(400).json({ status: 400, error: "Amount invalid!" });

    account.balance = Number(account?.balance) + Number(amount);
    await account.save();

    const newData = new TransactionSchema({
      accountId,
      amount: Number(amount),
      category,
      description,
      type: "DEPOSIT",
      date: new Date(),
      createdBy: _id,
      cardNumber,
    });
    const dataNew = await newData.save();

    return res.status(200).json({ status: "ok", data: dataNew.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error: JSON.stringify(error) });
  }
};
