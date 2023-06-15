import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface ITransactions extends IBaseModal {
  accountId: string;
  createdBy: string;
  type: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  cardNumber?: string;
}

const TransactionsSchema = createSchema({
  accountId: { type: mongoose.Types.ObjectId, ref: "Account", required: true },
  createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, required: true },
  cardNumber: { type: String, required: false },
});

TransactionsSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<ITransactions>(
  "Transactions",
  TransactionsSchema
);
