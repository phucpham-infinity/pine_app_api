import { Request, Response } from "express";
import CardSchema from "@/models/card";
import { isEmpty } from "lodash";

export const getAllCard = async (req: Request, res: Response) => {
  try {
    const data = await CardSchema.find();
    return res
      .status(200)
      .json({ status: "ok", data: data?.map((x) => x?.doc()) });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
