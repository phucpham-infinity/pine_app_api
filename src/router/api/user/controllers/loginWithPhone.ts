import { Request, Response } from "express";
import UserSchema from "@/models/user";

export const loginWithPhone = async (req: Request, res: Response) => {
  const { password, phone } = req?.body || {};
  try {
    const user = await UserSchema.findOne({ phone });

    if (!user)
      return res.status(400).json({ status: 400, error: "User not found!" });

    user.comparePassword(password, (err: any, isMatch: any) => {
      if (err) return res.status(400).json({ status: 400, error: err.message });
      if (!isMatch)
        return res
          .status(400)
          .json({ status: 400, error: "Password not match!" });

      return res.status(200).json({
        status: "ok",
        data: { ...user.doc(), token: user.generateToken() },
      });
    });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
