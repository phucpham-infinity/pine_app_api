import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";
import { ICompany } from "../company";
import { IUser } from "../user";
import { IRate } from "../rate";

export interface IProfile extends IBaseModal {
  firstName: string;
  lastName: string;
  nationality: string;
  IDNumber?: string;
  passportNumber?: string;
  issueDate?: string;
  expiryDate?: string;
}

const ProfileSchema = createSchema({
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
