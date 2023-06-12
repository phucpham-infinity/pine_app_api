import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface IUserCompanyRef extends IBaseModal {
  userId: string;
  companyId: string;
}

const UserCompanyRefSchema = createSchema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  companyId: { type: mongoose.Types.ObjectId, ref: "Company", required: true },
});

UserCompanyRefSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<IUserCompanyRef>(
  "UserCompanyRef",
  UserCompanyRefSchema
);
