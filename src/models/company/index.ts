import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface ICompany extends IBaseModal {
  companyName: string;
  email: string;
  businessActivity: string;
  legalType: string;
  numberOfEmployees: number;
}

const CompanySchema = createSchema({
  companyName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  businessActivity: { type: String, required: true },
  legalType: { type: String, required: true },
  numberOfEmployees: { type: Number, required: true },
});

CompanySchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<ICompany>("Company", CompanySchema);
