import { Request, Response } from "express";
import TransactionSchema from "@/models/transaction";
import AccountSchema from "@/models/account";
import InvoiceSchema from "@/models/invoice";

import { isNumber } from "lodash";

export const createInvoiceTransaction = async (req: Request, res: Response) => {
  const {
    accountId,
    amount,
    category,
    description,
    cardNumber,
    companyId,
    accountNumber,
    recipientType,
    recipientName,
    recipientEmail,
    recipientPhone,
    detailDueDate,
    detailType,
    invoiceNumber,
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
      type: "INVOICE",
      date: new Date(),
      createdBy: _id,
      cardNumber,
      companyId,
    });
    const dataNew = await newData.save();

    const newInvoice = new InvoiceSchema({
      accountNumber,
      companyId,
      createdBy: _id,
      detailAmount: Number(amount),
      detailDueDate,
      detailType,
      recipientEmail,
      recipientName,
      recipientPhone,
      recipientType,
      transactionsId: dataNew._id,
      invoiceNumber,
    });
    const newInvoiceData = await newInvoice.save();
    return res.status(200).json({
      status: "ok",
      data: { ...dataNew.doc(), invoice: newInvoiceData.doc() },
    });
  } catch (error) {
    return res.status(400).json({ status: 400, error: JSON.stringify(error) });
  }
};
