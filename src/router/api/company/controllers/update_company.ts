import { Request, Response } from "express";
import CompanySchema from "@/models/company";

export const updateCompany = async (req: Request, res: Response) => {
  const {
    businessActivity,
    email,
    legalType,
    numberOfEmployees,
    licenseNumber,
    backupEmail,
  } = req.body as any;

  const { name } = req.params;

  try {
    const newCompany = await CompanySchema.findOneAndUpdate(
      { companyName: name },
      {
        $set: {
          businessActivity,
          email,
          legalType,
          numberOfEmployees,
          licenseNumber,
          backupEmail,
        },
      },
      { new: true }
    );
    return res.status(200).json({ status: "ok", data: newCompany?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
