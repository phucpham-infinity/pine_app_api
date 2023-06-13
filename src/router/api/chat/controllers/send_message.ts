import { Request, Response } from "express";
import ChatSchema from "@/models/chat";

export const sendMessage = async (req: Request, res: Response) => {
  const { message, receiverId } = req.body as any;
  const { _id } = req.user || {};

  try {
    const newData = new ChatSchema({
      userId: _id,
      message,
      receiverId,
    });
    const dataNew = await newData.save();
    return res.status(200).json({ status: "ok", data: dataNew.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
