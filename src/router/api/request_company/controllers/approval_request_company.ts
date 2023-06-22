import { Request, Response } from "express";
import RequestCompanySchema from "@/models/request_company";
import CompanySchema from "@/models/company";
import UserSchema from "@/models/user";

import UserCompanyRefSchema from "@/models/user_company_ref";

export const approvalRequestCompany = async (req: Request, res: Response) => {
  const { companyName, userId, email } = req.query || {};
  let company: any;
  try {
    const company1 = await CompanySchema.findOne({ companyName });
    if (!company1) {
      const company2 = await CompanySchema.findOne({ companyName: "pineapp" });
      company = company2;
    } else {
      company = company1;
    }

    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(400).json({ status: 400, error: "User not found!" });
    }
    const newUserCompanyRef = new UserCompanyRefSchema({
      userId: user._id,
      companyId: company._id,
    });
    await newUserCompanyRef.save();

    const data = await RequestCompanySchema.findOneAndUpdate(
      { userEmail: email },
      {
        $set: { status: "APPROVAL" },
      },
      { new: true }
    );
    return res.status(200).json({ status: "ok", data: data });
  } catch (error) {
    //error
    return res.status(400).json({ status: 400, error });
  }
};
