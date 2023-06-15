import { Request, Response } from "express";
import TransactionSchema from "@/models/transaction";
import AccountSchema from "@/models/account";
import TransferSchema from "@/models/transfer";

import { isNumber } from "lodash";

export const createTransferTransaction = async (
  req: Request,
  res: Response
) => {
  const {
    accountId,
    amount,
    category,
    description,
    cardNumber,
    companyId,
    accountNumber,
    toCompanyName,
    toIban,
    toSwiftCode,
    detailType,
    transferNumber,
  } = req.body as any;
  const { _id } = req.user || {};
  try {
    const account = await AccountSchema.findById(accountId);

    if (!account)
      return res.status(400).json({ status: 400, error: "Account not found!" });

    if (!isNumber(+amount))
      return res.status(400).json({ status: 400, error: "Amount invalid!" });

    account.balance = Number(account?.balance) - Number(amount);
    await account.save();

    const newData = new TransactionSchema({
      accountId,
      amount: Number(amount),
      category,
      description,
      type: "TRANSFER",
      date: new Date(),
      createdBy: _id,
      cardNumber,
      companyId,
    });
    const dataNew = await newData.save();

    const newTransfer = new TransferSchema({
      accountNumber,
      companyId,
      createdBy: _id,
      detailAmount: Number(amount),
      detailType,
      transactionsId: dataNew._id,
      toCompanyName,
      toIban,
      toSwiftCode,
      transferNumber,
    });
    const newTransferData = await newTransfer.save();
    return res.status(200).json({
      status: "ok",
      data: { ...dataNew.doc(), invoice: newTransferData.doc() },
    });
  } catch (error) {
    return res.status(400).json({ status: 400, error: JSON.stringify(error) });
  }
};
