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
    coverUrl,
  } = req.body as any;

  const { id } = req.params;

  try {
    const newCompany = await CompanySchema.findByIdAndUpdate(
      id,
      {
        $set: {
          businessActivity,
          email,
          legalType,
          numberOfEmployees,
          licenseNumber,
          backupEmail,
          coverUrl,
        },
      },
      { new: true }
    );
    if (!newCompany)
      res.status(400).json({ status: 400, error: "Company not found!" });
    return res.status(200).json({ status: "ok", data: newCompany?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
