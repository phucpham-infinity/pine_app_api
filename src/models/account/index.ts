import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";
import { IUser } from "../user";

export interface IAccount extends IBaseModal {
  accountName: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  user: IUser;
  balance: number;
  isMain?: boolean;
}

const AccountSchema = createSchema({
  accountName: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true, unique: true },
  iban: { type: String, required: true, unique: true },
  swiftCode: { type: String, required: true },
  phone: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  isMain: { type: Boolean, required: false, default: false },
});

AccountSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<IAccount>("Account", AccountSchema);
