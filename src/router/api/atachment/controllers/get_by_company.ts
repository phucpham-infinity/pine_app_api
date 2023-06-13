import { Request, Response } from "express";
import AtachmentSchema from "@/models/atachment";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const getByCompany = async (req: Request, res: Response) => {
  const { id } = req.params;

  const companyId = new ObjectId(id);

  try {
    const newData = await AtachmentSchema.find({ companyId });
    return res
      .status(200)
      .json({ status: "ok", data: newData?.map((x) => x?.doc()) });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
