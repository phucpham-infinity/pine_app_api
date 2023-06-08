import { Request, Response } from "express";
import UserSchema from "@/models/user";

export const getByPhone = async (req: Request, res: Response) => {
  const { phone } = req.params || {};
  try {
    const data = await UserSchema.findOne({ phone });
    if (!data)
      return res.status(400).json({ status: 400, error: "User not found!" });
    return res.status(200).json({ status: "ok", data: data?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
