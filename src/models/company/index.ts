import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface ICompany extends IBaseModal {
  companyName: string;
  email: string;
  businessActivity: string;
  legalType: string;
  numberOfEmployees: number;
  licenseNumber?: string;
  backupEmail?: string;
  coverUrl?: string;
  status: "PROCESSING" | "VERIFIED" | "DELIVERY" | "DONE";
}

const CompanySchema = createSchema({
  companyName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  businessActivity: { type: String, required: true },
  legalType: { type: String, required: true },
  numberOfEmployees: { type: Number, required: true },
  licenseNumber: { type: String, required: false, default: "" },
  backupEmail: { type: String, required: false, default: "" },
  coverUrl: { type: String, required: false },
  status: { type: String, required: false, default: "PROCESSING" },
});

CompanySchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<ICompany>("Company", CompanySchema);
