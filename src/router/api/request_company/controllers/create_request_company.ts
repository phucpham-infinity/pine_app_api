import { Request, Response } from "express";
import RequestCompanySchema from "@/models/request_company";
import { IRequestCompany } from "@/models/request_company";

export const createRequestCompany = async (req: Request, res: Response) => {
  const { companyName, companyEmail, licenseNo, registerNo, userEmail } =
    req.body as Partial<IRequestCompany>;

  const { phone } = req.user || {};

  const newRequest = new RequestCompanySchema({
    companyName,
    companyEmail,
    licenseNo,
    registerNo,
    userEmail,
    phone: phone,
  });

  try {
    const newRequestData = await newRequest.save();
    return res.status(200).json({ status: "ok", data: newRequestData.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
