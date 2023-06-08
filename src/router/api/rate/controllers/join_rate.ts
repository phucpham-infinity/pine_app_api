import { Request, Response } from "express";
import ProfileSchema from "@/models/profile";
import RateSchema from "@/models/rate";

export const joinRate = async (req: Request, res: Response) => {
  const { rateName } = req.query || {};
  const { _id } = req.user || {};
  console.log(rateName, _id);

  try {
    const rate = await RateSchema.findOne({ name: rateName });
    console.log(rate?.id);

    if (!rate)
      return res
        .status(400)
        .json({ status: 400, error: new Error("Rate not found") });

    const profile = await ProfileSchema.findOneAndUpdate(
      { user: _id },
      {
        $set: { rate: rate?.id },
      },
      { new: true }
    );
    return res.status(200).json({ status: "ok", data: profile?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
