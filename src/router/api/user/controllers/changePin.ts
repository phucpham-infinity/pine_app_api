import { Request, Response } from "express";
import UserSchema from "@/models/user";

export const changePin = async (req: Request, res: Response) => {
  const { password, newPassword } = req?.body || {};
  const { _id } = req.user || {};
  try {
    const user = await UserSchema.findById(_id);

    if (!user)
      return res.status(400).json({ status: 400, error: "User not found!" });

    user.comparePassword(password, async (err: any, isMatch: any) => {
      if (err) return res.status(400).json({ status: 400, error: err.message });
      if (!isMatch)
        return res
          .status(400)
          .json({ status: 400, error: "Password not match!" });
      user.password = newPassword;
      const newUser = await user.save();
      return res.status(200).json({ status: "ok", data: newUser?.doc() });
    });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
