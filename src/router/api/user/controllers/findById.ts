import { Request, Response } from "express";
import UserSchema from "@/models/user";
import { isEmpty } from "lodash";

export const findById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await UserSchema.findById(id);
    if (isEmpty(data))
      return res.status(400).json({ status: 400, error: "User not found!" });
    return res.status(200).json({ status: "ok", data: data?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
