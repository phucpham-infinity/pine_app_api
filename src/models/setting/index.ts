import { omit } from "lodash";
import { IBaseModal, createSchema } from "@/helpers";
import mongoose from "mongoose";

export interface ISetting extends IBaseModal {
  userId: string;
  enableBiometric: boolean;
  confirmationMethods: "FACE_ID" | "PUSH_NOTIFICATION" | "TEXT_MESSAGE";
  receiveNotificationsForPaymentsAndTransfers: boolean;
  receiveNotificationsForDeposits: boolean;
  receiveNotificationsForOutstandingInvoices: boolean;
  receiveNotificationsForExceedingSetLimits: boolean;
  notificationMethods: "PUSH_NOTIFICATION" | "TEXT_MESSAGE" | "EMAIL";
  mainAccountId: string;
}

const SettingSchema = createSchema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  mainAccountId: {
    type: mongoose.Types.ObjectId,
    ref: "Account",
    required: false,
  },
  enableBiometric: { type: Boolean, required: true, default: false },
  confirmationMethods: {
    type: String,
    required: true,
    default: "BIOMETRIC_ID",
  },
  receiveNotificationsForPaymentsAndTransfers: {
    type: Boolean,
    required: true,
    default: false,
  },
  receiveNotificationsForDeposits: {
    type: Boolean,
    required: true,
    default: false,
  },
  receiveNotificationsForOutstandingInvoices: {
    type: Boolean,
    required: true,
    default: false,
  },
  receiveNotificationsForExceedingSetLimits: {
    type: Boolean,
    required: true,
    default: false,
  },
  notificationMethods: { type: String, required: true, default: "EMAIL" },
});

SettingSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

export default mongoose.model<ISetting>("Setting", SettingSchema);
