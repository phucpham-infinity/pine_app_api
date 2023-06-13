import { Request, Response } from "express";
import AtachmentSchema from "@/models/atachment";

export const createAtachment = async (req: Request, res: Response) => {
  const { name, type, companyId, url } = req.body as any;

  try {
    const newData = new AtachmentSchema({
      name,
      type,
      companyId,
      url,
    });
    const dataNew = await newData.save();
    return res.status(200).json({ status: "ok", data: dataNew.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
