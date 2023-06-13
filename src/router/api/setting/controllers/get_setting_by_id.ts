import { Request, Response } from "express";
import SettingSchema from "@/models/setting";

export const getSettingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await SettingSchema.findById(id);
    if (!data)
      return res.status(400).json({ status: 400, error: "Setting not found!" });
    return res.status(200).json({ status: "ok", data: data?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
