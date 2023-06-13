import { Request, Response } from "express";
import CompanySchema from "@/models/company";
import { ICompany } from "@/models/company";

export const createCompany = async (req: Request, res: Response) => {
  const {
    businessActivity,
    companyName,
    email,
    legalType,
    numberOfEmployees,
    licenseNumber,
    backupEmail,
    coverUrl,
  } = req.body as Partial<ICompany>;

  const newCompany = new CompanySchema({
    businessActivity,
    companyName,
    email,
    legalType,
    numberOfEmployees,
    licenseNumber,
    backupEmail,
    coverUrl,
  });

  try {
    const newCompany2 = await newCompany.save();
    return res.status(200).json({ status: "ok", data: newCompany2.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
