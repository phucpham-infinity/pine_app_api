import { Request, Response } from "express";
import UserSchema from "@/models/user";

export const loginWithEmailPassword = async (req: Request, res: Response) => {
  const body = req.body;
  const password = body?.password || "";
  const email = body?.email || "";
  try {
    const user = await UserSchema.findOne({ email });

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
