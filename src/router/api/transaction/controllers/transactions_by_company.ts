import { Request, Response } from "express";
import TransactionSchema from "@/models/transaction";
import mongoose from "mongoose";
import { pickBy, identity } from "lodash";
import { isAfter } from "date-fns";

const ObjectId = mongoose.Types.ObjectId;

export const getTransactionsByCompany = async (req: Request, res: Response) => {
  const { _id } = req?.user || {};
  const { companyId: _companyId } = req.params || {};
  const { invoiceType, transferType, type, fromDate, toDate } = req.query || {};
  const id = new ObjectId(_id);
  const companyId = new ObjectId(_companyId);

  if (toDate && fromDate) {
    if (!isAfter(new Date(toDate as string), new Date(fromDate as string))) {
      return res.status(400).json({ status: 400, error: "Invalid date range" });
    }
  }

  const where = pickBy(
    {
      companyId: companyId,
      createdBy: id,
      "invoice.detailType": invoiceType,
      "transfer.detailType": transferType,
      type,
      createdAt: !!fromDate &&
        !!toDate && {
          $gte: new Date(fromDate as string),
          $lte: new Date(toDate as string),
        },
    },
    identity
  );

  console.log("ưherw", where);

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
    ]);
    return res.status(200).json({ status: "ok", data: transactions });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
