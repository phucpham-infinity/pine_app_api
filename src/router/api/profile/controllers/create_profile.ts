import { Request, Response } from "express";
import ProfileSchema from "@/models/profile";
import UserSchema from "@/models/user";
import CompanySchema from "@/models/company";

export const createCompany = async (req: Request, res: Response) => {
  const {
    IDNumber,
    firstName,
    expiryDate,
    issueDate,
    lastName,
    nationality,
    passportNumber,
    phone,
    companyName,
  } = req.body as any;
  try {
    const user = await UserSchema.findOne({ phone });
    if (!user)
      return res.status(400).json({ status: 400, error: "User not found!" });
    let company: any = {};
    if (companyName) {
      company = await CompanySchema.findOne({ companyName });
    }

    const newProfile = new ProfileSchema({
      user: user?.id,
      company: company?.id,
      IDNumber,
      firstName,
      expiryDate,
      issueDate,
      lastName,
      nationality,
      passportNumber,
    });
    const profileNew = await newProfile.save();
    return res.status(200).json({ status: "ok", data: profileNew.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
