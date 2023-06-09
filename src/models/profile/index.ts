import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface IProfile extends IBaseModal {
  firstName: string;
  lastName: string;
  nationality: string;
  IDNumber?: string;
  passportNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  type: "COMPANY" | "PERSONAL";
}

const ProfileSchema = createSchema({
  type: { type: String, required: false, default: "PERSONAL" },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nationality: { type: String, required: true },
  IDNumber: { type: String, required: false },
  passportNumber: { type: String, required: false },
  issueDate: { type: Date, required: false },
  expiryDate: { type: Date, required: false },
});

ProfileSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<IProfile>("Profile", ProfileSchema);
