import { Request, Response } from "express";
import UserCompanyRefSchema from "@/models/user_company_ref";

export const joinCompany = async (req: Request, res: Response) => {
  const { companyName } = req.query || {};
  const { phone } = req.user || {};

  try {
    const newData = new UserCompanyRefSchema({
      phone,
      companyName,
    });
    const dataNew = await newData.save();
    return res.status(200).json({ status: "ok", data: dataNew?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
