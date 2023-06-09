import { Request, Response } from "express";
import TransactionSchema from "@/models/transaction";
import mongoose from "mongoose";
import { pickBy, identity } from "lodash";
import { isAfter } from "date-fns";

const ObjectId = mongoose.Types.ObjectId;

export const getTransactionsByAccount = async (req: Request, res: Response) => {
  const { _id } = req?.user || {};
  const { accountId: _accountId } = req.params || {};
  const { invoiceTypes, transferTypes, types, fromDate, toDate } =
    req.query || {};

  const id = new ObjectId(_id);
  const accountId = new ObjectId(_accountId);

  if (toDate && fromDate) {
    if (!isAfter(new Date(toDate as string), new Date(fromDate as string))) {
      return res.status(400).json({ status: 400, error: "Invalid date range" });
    }
  }

  const where = pickBy(
    {
      accountId: accountId,
      createdBy: id,
      "invoice.detailType": invoiceTypes &&
        invoiceTypes != "null" &&
        invoiceTypes != "[]" && {
          $in: JSON.parse(invoiceTypes as string),
        },
      "transfer.detailType": transferTypes &&
        transferTypes != "null" &&
        transferTypes != "[]" && {
          $in: JSON.parse(transferTypes as string),
        },
      type: types &&
        types != "null" &&
        types != "[]" && {
          $in: JSON.parse(types as string),
        },
      createdAt: !!fromDate &&
        !!toDate && {
          $gte: new Date(fromDate as string),
          $lte: new Date(toDate as string),
        },
    },
    identity
  );

  console.log("where", where);

  try {
    const transactions = await TransactionSchema.aggregate([
      {
        $lookup: {
          from: "invoices",
          localField: "_id",
          foreignField: "transactionsId",
          as: "invoice",
        },
      },
      { $unwind: { path: "$invoice", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "transfers",
          localField: "_id",
          foreignField: "transactionsId",
          as: "transfer",
        },
      },
      { $unwind: { path: "$transfer", preserveNullAndEmptyArrays: true } },
      {
        $match: where,
      },
    ]).sort({ createdAt: -1 });
    return res.status(200).json({ status: "ok", data: transactions });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
