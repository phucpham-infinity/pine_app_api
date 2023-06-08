import { Request, Response } from "express";
import UserSchema from "@/models/user";
import { omit } from "lodash";

export const me = async (req: Request, res: Response) => {
  const { user } = req;

  const user2 = await UserSchema.aggregate([
    {
      $lookup: {
        from: "profiles",
        localField: "_id",
        foreignField: "user",
        as: "profile",
      },
    },
    {
      $unwind: { path: "$profile", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "companies",
        localField: "profile.company",
        foreignField: "_id",
        as: "profile.company",
      },
    },
    { $unwind: { path: "$profile.company", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "rates",
        localField: "profile.rate",
        foreignField: "_id",
        as: "profile.rate",
      },
    },
    { $unwind: { path: "$profile.rate", preserveNullAndEmptyArrays: true } },
    {
      $match: {
        phone: user.phone,
      },
    },
  ]);
  if (!user2)
    return res.status(400).json({ status: 400, error: "User not found!" });
  return res
    .status(200)
    .json({ status: "ok", data: omit(user2?.[0], ["password", "__v"]) });
};
