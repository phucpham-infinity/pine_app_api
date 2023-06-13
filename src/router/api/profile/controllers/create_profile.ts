import { Request, Response } from "express";
import ProfileSchema from "@/models/profile";
import UserProfileRef from "@/models/user_profile_ref";

export const createCompany = async (req: Request, res: Response) => {
  const {
    IDNumber,
    firstName,
    expiryDate,
    issueDate,
    lastName,
    nationality,
    passportNumber,
  } = req.body as any;
  const { _id } = req?.user || {};
  try {
    const newProfile = new ProfileSchema({
      IDNumber,
      firstName,
      expiryDate,
      issueDate,
      lastName,
      nationality,
      passportNumber,
    });
    const profileNew = await newProfile.save();
    const refNew = new UserProfileRef({
      userId: _id,
      yarn: profileNew.id,
    });
    await refNew.save();
    return res.status(200).json({ status: "ok", data: profileNew.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
