import { Request, Response } from "express";
import ProfileSchema from "@/models/profile";
import UserProfileRef from "@/models/user_profile_ref";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;
export const createProfileByUserId = async (req: Request, res: Response) => {
  const {
    IDNumber,
    firstName,
    expiryDate,
    issueDate,
    lastName,
    nationality,
    passportNumber,
    type,
  } = req.body as any;
  const { id: _id } = req?.params || {};

  const id = new ObjectId(_id);
  try {
    const newProfile = new ProfileSchema({
      IDNumber,
      firstName,
      expiryDate,
      issueDate,
      lastName,
      nationality,
      passportNumber,
      type,
    });
    const profileNew = await newProfile.save();
    const userProfileRef = await UserProfileRef.findOne({ userId: id });
    if (!userProfileRef) {
      const refNew = new UserProfileRef({
        userId: _id,
        profileId: profileNew.id,
      });
      await refNew.save();
      return res.status(200).json({ status: "ok", data: profileNew.doc() });
    } else {
      await UserProfileRef.findByIdAndUpdate(
        userProfileRef._id,
        {
          $set: {
            userId: _id,
            profileId: profileNew._id,
          },
        },
        { new: true }
      );
      return res.status(200).json({ status: "ok", data: profileNew.doc() });
    }
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
