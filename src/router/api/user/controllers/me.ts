import { Request, Response } from "express";
import UserSchema from "@/models/user";
import { omit } from "lodash";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const me = async (req: Request, res: Response) => {
  const { _id } = req.user || {};
  const id = new ObjectId(_id);

  const meData = await UserSchema.aggregate([
    // profile
    {
      $lookup: {
        from: "userprofilerefs",
        localField: "_id",
        foreignField: "userId",
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
        localField: "_id",
        foreignField: "userId",
        as: "company",
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "company.companyId",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
    // Request Company
    {
      $lookup: {
        from: "requestcompanies",
        localField: "_id",
        foreignField: "userId",
        as: "requestCompany",
      },
    },
    { $unwind: { path: "$requestCompany", preserveNullAndEmptyArrays: true } },
    // Rate
    {
      $lookup: {
        from: "userraterefs",
        localField: "_id",
        foreignField: "userId",
        as: "rate",
      },
    },
    { $unwind: { path: "$rate", preserveNullAndEmptyArrays: true } },
    // setting
    {
      $lookup: {
        from: "settings",
        localField: "_id",
        foreignField: "userId",
        as: "setting",
      },
    },
    { $unwind: { path: "$setting", preserveNullAndEmptyArrays: true } },
    // accounts
    {
      $lookup: {
        from: "accounts",
        localField: "_id",
        foreignField: "userId",
        as: "accounts",
      },
    },
    { $unwind: { path: "$profile.rate", preserveNullAndEmptyArrays: true } },
    { $match: { _id: id } },
  ]);

  if (!meData)
    return res.status(400).json({ status: 400, error: "User not found!" });
  return res
    .status(200)
    .json({ status: "ok", data: omit(meData?.[0], ["password", "__v"]) });
};
