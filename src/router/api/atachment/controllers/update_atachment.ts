import { Request, Response } from "express";
import AtachmentSchema from "@/models/atachment";

export const updateAtachment = async (req: Request, res: Response) => {
  const { name, type, url } = req.body as any;
  const { id } = req.params;

  try {
    const newData = await AtachmentSchema.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          type,
          url,
        },
      },
      { new: true }
    );
    if (!newData)
      res.status(400).json({ status: 400, error: "Atachment not found!" });
    return res.status(200).json({ status: "ok", data: newData?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
