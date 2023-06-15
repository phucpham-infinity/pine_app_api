import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface ITransfer extends IBaseModal {
  companyId: string;
  createdBy: string;
  accountNumber: string;
  transactionsId: string;
  toCompanyName: string;
  toIban: string;
  toSwiftCode: string;
  detailType: string;
  detailAmount: string;
  transferNumber: string;
}

const TransferSchema = createSchema({
  companyId: { type: mongoose.Types.ObjectId, ref: "Company", required: true },
  createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  accountNumber: { type: String, required: true },
  transactionsId: {
    type: mongoose.Types.ObjectId,
    ref: "Transactions",
    required: true,
  },
  toCompanyName: { type: String, required: true },
  toIban: { type: String, required: true },
  toSwiftCode: { type: String, required: true },
  detailType: { type: String, required: true },
  detailAmount: { type: String, required: true },
  transferNumber: { type: String, required: true, unique: true },
});

TransferSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<ITransfer>("Transfer", TransferSchema);
