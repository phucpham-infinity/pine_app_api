import { Request, Response } from "express";
import UserSchema from "@/models/user";

export const changePhone = async (req: Request, res: Response) => {
  const { newPhone } = req?.body || {};
  const { phone } = req.user || {};
  try {
    const user = await UserSchema.findOne({ phone });

    if (!user)
      return res.status(400).json({ status: 400, error: "User not found!" });
    user.phone = newPhone;

    const newUser = await user.save();
    return res.status(200).json({ status: "ok", data: newUser?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
