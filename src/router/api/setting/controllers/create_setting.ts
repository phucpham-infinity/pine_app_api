import { Request, Response } from "express";
import SettingSchema from "@/models/setting";

export const createForMe = async (req: Request, res: Response) => {
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
  try {
    const newData = new SettingSchema({
      userId: _id,
      confirmationMethods,
      enableBiometric,
      notificationMethods,
      receiveNotificationsForDeposits,
      receiveNotificationsForExceedingSetLimits,
      receiveNotificationsForOutstandingInvoices,
      receiveNotificationsForPaymentsAndTransfers,
      mainAccountId,
    });
    const dataNew = await newData.save();
    return res.status(200).json({ status: "ok", data: dataNew.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
