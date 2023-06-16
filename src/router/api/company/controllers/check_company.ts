import { Request, Response } from "express";
import CompanySchema from "@/models/company";

export const checkCompany = async (req: Request, res: Response) => {
  const { companyId } = req.query || {};

  console.log("companyId", companyId);

  try {
    const companyData = await CompanySchema.findById(companyId);
    if (!companyData)
      return res.status(400).json({ status: 400, error: "Company not found!" });
    if (companyData.status === "PROCESSING") {
      companyData.status = "VERIFIED";
      await companyData.save();
      return res.status(200).json({ status: "ok", data: companyData?.doc() });
    } else if (companyData.status === "VERIFIED") {
      companyData.status = "DELIVERY";
      await companyData.save();
      return res.status(200).json({ status: "ok", data: companyData?.doc() });
    } else if (companyData.status === "DELIVERY") {
      companyData.status = "DONE";
      await companyData.save();
      return res.status(200).json({ status: "ok", data: companyData?.doc() });
    } else if (companyData.status == "DONE") {
      return res.status(200).json({ status: "ok", data: companyData?.doc() });
    }
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
