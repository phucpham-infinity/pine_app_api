import { Request, Response } from "express";
import Chatchema from "@/models/chat";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;
export const messageByMe = async (req: Request, res: Response) => {
  const { _id } = req.user || {};
  const id = new ObjectId(_id);
  try {
    const data = await Chatchema.find({ userId: id });
    return res.status(200).json({ status: "ok", data: data });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
