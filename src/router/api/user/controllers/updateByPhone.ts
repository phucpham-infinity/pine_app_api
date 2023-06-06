import { Request, Response } from "express";
import UserSchema from "@/models/user";

export const updateByPhone = async (req: Request, res: Response) => {
  const { isUseFaceId, isUseTouchId, phone } = req.body;

  try {
    const user = await UserSchema.findOneAndUpdate(
      {
        phone,
      },
      { $set: { isUseFaceId, isUseTouchId } },
      { new: true }
    );
    if (!user) res.status(400).json({ status: 400, error: "User not found!" });
    return res.status(200).json({ status: "ok", data: user?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
