import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface IChat extends IBaseModal {
  userId: string;
  message: string;
  isRead: boolean;
  receiverId?: string;
}

const ChatSchema = createSchema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: false },
  isRead: { type: String, required: false, default: false },
  receiverId: { type: mongoose.Types.ObjectId, ref: "User", required: false },
});

ChatSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<IChat>("Chat", ChatSchema);
