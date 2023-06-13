import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface IAtachment extends IBaseModal {
  companyId: string;
  url: string;
  type: string;
  name: string;
}

const AtachmentSchema = createSchema({
  companyId: { type: mongoose.Types.ObjectId, ref: "Company", required: true },
  url: { type: String, required: false },
  type: { type: String, required: false },
  name: { type: String, required: false },
});

AtachmentSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<IAtachment>("Atachment", AtachmentSchema);
