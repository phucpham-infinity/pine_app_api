import { Request, Response } from "express";
import RequestAccountSchema from "@/models/request_account";
import UserSchema from "@/models/user";

export const createRequestAccount = async (req: Request, res: Response) => {
  const { userId, status } = req.body as any;

  const newRequest = new RequestAccountSchema({ status, user: userId });

  try {
    const user = await UserSchema.findById(userId);
    if (!user)
      return res.status(400).json({ status: 400, error: "User not found!" });
    const newRequestData = await newRequest.save();
    return res.status(200).json({ status: "ok", data: newRequestData.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
