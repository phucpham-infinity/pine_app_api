import { Request, Response } from "express";
import UserSchema from "@/models/user";
import { omit } from "lodash";

export const me = async (req: Request, res: Response) => {
  const { user } = req;

  const user2 = await UserSchema.aggregate([
    { $unwind: { path: "$profile.company", preserveNullAndEmptyArrays: true } },
    // profile
    {
      $lookup: {
        from: "userprofilerefs",
        localField: "phone",
        foreignField: "phone",
        as: "profile",
      },
    },
    {
      $lookup: {
        from: "profiles",
        localField: "profile.profileId",
        foreignField: "_id",
        as: "profile",
      },
    },
    { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
    // Company
    {
      $lookup: {
        from: "usercompanyrefs",
        localField: "phone",
        foreignField: "phone",
        as: "company",
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "company.companyName",
        foreignField: "companyName",
        as: "company",
      },
    },
    { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
    // Rate
    {
      $lookup: {
        from: "userraterefs",
        localField: "phone",
        foreignField: "phone",
        as: "rate",
      },
    },
    { $unwind: { path: "$rate", preserveNullAndEmptyArrays: true } },
    // accounts
    {
      $lookup: {
        from: "accounts",
        localField: "phone",
        foreignField: "phone",
        as: "accounts",
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
