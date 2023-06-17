import { Request, Response } from "express";
import AccountSchema from "@/models/account";

export const removeAccount = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const newData = await AccountSchema.findByIdAndRemove(id, {
      returnOriginal: true,
    });
    return res.status(200).json({ status: "ok", data: newData?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
