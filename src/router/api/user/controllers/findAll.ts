import { Request, Response } from "express";
import UserSchema from "@/models/user";

export const findAll = async (req: Request, res: Response) => {
  try {
    const data = await UserSchema.find();
    return res
      .status(200)
      .json({ status: "ok", data: data?.map((x) => x.doc()) });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
