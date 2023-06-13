import { Request, Response } from "express";
import UserRateRefSchema from "@/models/user_rate_ref";

export const joinRate = async (req: Request, res: Response) => {
  const { rateName } = req.query || {};
  const { _id } = req.user || {};

  try {
    const refData = await UserRateRefSchema.findOne({ userId: _id });
    if (refData) {
      const newRefData = await UserRateRefSchema.findOneAndUpdate(
        { userId: _id },
        {
          $set: {
            rateName,
          },
        },
        { new: true }
      );
      return res.status(200).json({ status: "ok", data: newRefData?.doc() });
    }
    const newData = new UserRateRefSchema({
      userId: _id,
      rateName,
    });
    const dataNew = await newData.save();
    return res.status(200).json({ status: "ok", data: dataNew?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
