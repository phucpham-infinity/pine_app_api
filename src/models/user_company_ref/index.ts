import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface IUserCompanyRef extends IBaseModal {
  phone: string;
  companyName: string;
}

const UserCompanyRefSchema = createSchema({
  phone: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
});

UserCompanyRefSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<IUserCompanyRef>(
  "UserCompanyRef",
  UserCompanyRefSchema
);
