import { Request, Response } from "express";
import UserSchema from "@/models/user";

export const register = async (req: Request, res: Response) => {
  const {
    phone,
    password,
    isUseFaceId = false,
    isUseTouchId = false,
  } = req.body;

  const newUser = new UserSchema({
    password,
    phone,
    isUseFaceId,
    isUseTouchId,
  });

  try {
    const user = await newUser.save();
    return res
      .status(200)
      .json({
        status: "ok",
        data: { ...user.doc(), token: user.generateToken() },
      });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
