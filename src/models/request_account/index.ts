import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface IRequestAccount extends IBaseModal {
  user: string;
  status: "PENDING" | "APPROVAL" | "REJECT";
}

const RequestAccountSchema = createSchema({
  user: {
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

RequestAccountSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<IRequestAccount>(
  "RequestAccount",
  RequestAccountSchema
);
