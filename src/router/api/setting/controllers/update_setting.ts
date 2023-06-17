import { Request, Response } from "express";
import SettingSchema from "@/models/setting";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const updateSetting = async (req: Request, res: Response) => {
  const {
    confirmationMethods,
    enableBiometric,
    notificationMethods,
    receiveNotificationsForDeposits,
    receiveNotificationsForExceedingSetLimits,
    receiveNotificationsForOutstandingInvoices,
    receiveNotificationsForPaymentsAndTransfers,
    mainAccountId,
  } = req.body as any;

  const { _id } = req.user || {};

  const userId = new ObjectId(_id);

  try {
    const newData = await SettingSchema.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          confirmationMethods,
          enableBiometric,
          notificationMethods,
          receiveNotificationsForDeposits,
          receiveNotificationsForExceedingSetLimits,
          receiveNotificationsForOutstandingInvoices,
          receiveNotificationsForPaymentsAndTransfers,
          mainAccountId,
        },
      },
      { new: true }
    );

    if (!newData)
      return res.status(400).json({ status: 400, error: "Data not found!" });
    return res.status(200).json({ status: "ok", data: newData?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
