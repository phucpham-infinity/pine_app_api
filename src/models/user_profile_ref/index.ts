import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface IUserProfileRef extends IBaseModal {
  phone: string;
  profileId: string;
}

const UserProfileRefSchema = createSchema({
  phone: { type: String, required: true, unique: true },
  profileId: { type: mongoose.Types.ObjectId, ref: "Profile", unique: true },
});

UserProfileRefSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<IUserProfileRef>(
  "UserProfileRef",
  UserProfileRefSchema
);
