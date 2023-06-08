import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface IRateType extends IBaseModal {
  name: string;
  fee: string;
  transactions: string;
  atmDeposits: string;
  addOns: string;
  books: string;
}

const RateSchema = createSchema({
  name: { type: String, required: true, unique: true },
  fee: { type: String, required: true },
  transactions: { type: String, required: true },
  atmDeposits: { type: String, required: true },
  addOns: { type: String, required: true },
  books: { type: String, required: true },
});

RateSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<IRateType>("Rate", RateSchema);
