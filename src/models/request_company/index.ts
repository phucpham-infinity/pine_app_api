import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface IRequestCompany extends IBaseModal {
  companyName: string;
  licenseNo: string;
  registerNo: string;
  companyEmail: string;
  userEmail: string;
  userId: string;
  status: "PENDING" | "APPROVAL" | "REJECT";
}

const RequestCompanySchema = createSchema({
  companyName: { type: String, required: true },
  licenseNo: { type: String, required: true },
  registerNo: { type: String, required: true },
  companyEmail: { type: String, required: true },
  userEmail: { type: String, required: true, unique: true },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVAL", "REJECT"],
    default: "PENDING",
  },
});

RequestCompanySchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<IRequestCompany>(
  "RequestCompany",
  RequestCompanySchema
);
