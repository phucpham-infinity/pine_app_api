import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface IInvoice extends IBaseModal {
  companyId: string;
  createdBy: string;
  accountNumber: string;
  transactionsId: string;
  recipientType: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  detailDueDate: string;
  detailType: string;
  detailAmount: string;
  invoiceNumber: string;
}

const InvoiceSchema = createSchema({
  companyId: { type: mongoose.Types.ObjectId, ref: "Company", required: true },
  createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  accountNumber: { type: String, required: true },
  transactionsId: {
    type: mongoose.Types.ObjectId,
    ref: "Transactions",
    required: true,
  },
  recipientType: { type: String, required: true },
  recipientName: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  recipientPhone: { type: String, required: true },
  detailDueDate: { type: String, required: true },
  detailType: { type: String, required: true },
  detailAmount: { type: String, required: true },
  invoiceNumber: { type: String, required: true, unique: true },
});

InvoiceSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<IInvoice>("Invoice", InvoiceSchema);
