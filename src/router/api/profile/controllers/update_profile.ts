import { Request, Response } from "express";
import ProfileSchema from "@/models/profile";
import UserSchema from "@/models/user";
import CompanySchema from "@/models/company";

export const upadateCompany = async (req: Request, res: Response) => {
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
      if (!company)
        return res
          .status(400)
          .json({ status: 400, error: "Company not found" });
    }

    const profile = await ProfileSchema.findOneAndUpdate(
      { user: user.id },
      {
        $set: {
          IDNumber,
          firstName,
          expiryDate,
          issueDate,
          lastName,
          nationality,
          passportNumber,
          company: company?.id,
        },
      },
      { new: true }
    );

    return res.status(200).json({ status: "ok", data: profile?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
