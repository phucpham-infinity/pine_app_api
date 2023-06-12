import { Request, Response } from "express";
import CardSchema from "@/models/card";

export const getCardById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await CardSchema.findById(id);
    return res.status(200).json({ status: "ok", data: data?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
