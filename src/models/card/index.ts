import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface ICard extends IBaseModal {
  cardType: string;
  nicname: string;
  status: string;
  cardNumber: string;
  accountNumber: string;
}

const CardSchema = createSchema({
  cardType: { type: String, required: true },
  nicname: { type: String, required: true },
  status: { type: String, required: true },
  cardNumber: { type: String, required: true },
  accountNumber: { type: String, required: true },
});

CardSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<ICard>("Card", CardSchema);
