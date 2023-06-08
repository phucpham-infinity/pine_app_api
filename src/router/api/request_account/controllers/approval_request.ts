import { Request, Response } from "express";
import RequestAccountSchema from "@/models/request_account";

export const approvalRequestAccount = async (req: Request, res: Response) => {
  const { userId } = req.query || {};

  try {
    const data = await RequestAccountSchema.findOneAndUpdate(
      { user: userId },
      {
        $set: { status: "APPROVAL" },
      },
      { new: true }
    );
    return res.status(200).json({ status: "ok", data: data });
  } catch (error) {
    //error
    return res.status(400).json({ status: 400, error });
  }
};
