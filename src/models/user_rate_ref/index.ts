import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface IUserRateRef extends IBaseModal {
  rateName: string;
  phone: string;
}

const UserRateRefSchema = createSchema({
  phone: { type: String, required: true, unique: true },
  rateName: { type: String, required: true },
});

UserRateRefSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<IUserRateRef>("UserRateRef", UserRateRefSchema);
