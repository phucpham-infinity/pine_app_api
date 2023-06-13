import { Request, Response } from "express";
import SettingSchema from "@/models/setting";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const getSettingByMe = async (req: Request, res: Response) => {
  const { _id } = req.user || {};
  const userId = new ObjectId(_id);

  try {
    const data = await SettingSchema.findOne({ userId });
    if (!data)
      return res.status(400).json({ status: 400, error: "Setting not found!" });
    return res.status(200).json({ status: "ok", data: data?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
