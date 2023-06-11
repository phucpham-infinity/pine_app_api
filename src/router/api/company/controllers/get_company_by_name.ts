import { Request, Response } from "express";
import UserCompanySchema from "@/models/company";

export const getCompanyByName = async (req: Request, res: Response) => {
  const { name } = req.params || {};

  try {
    const data = await UserCompanySchema.findOne({ companyName: name });
    if (!data)
      res.status(400).json({ status: 400, error: "Company not found!" });
    return res.status(200).json({ status: "ok", data: data?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
