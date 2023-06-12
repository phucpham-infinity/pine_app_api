import { Request, Response } from "express";
import UserRateRefSchema from "@/models/user_rate_ref";

export const joinRate = async (req: Request, res: Response) => {
  const { rateName } = req.query || {};
  const { phone } = req.user || {};

  try {
    const refData = await UserRateRefSchema.findOne({ phone });
    if (refData) {
      const newRefData = await UserRateRefSchema.findOneAndUpdate(
        { phone },
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
      phone,
      rateName,
    });
    const dataNew = await newData.save();
    return res.status(200).json({ status: "ok", data: dataNew?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
