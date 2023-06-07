import { Request, Response } from "express";
import RequestCompanySchema from "@/models/request_company";
import { IRequestCompany } from "@/models/request_company";

export const approvalRequestCompany = async (req: Request, res: Response) => {
  const { id } = req.params || {};
  try {
    const data = await RequestCompanySchema.findOneAndUpdate(
      { id },
      {
        $set: { status: "APPROVAL" },
      },
      { new: true }
    );
    return res.status(200).json({ status: "ok", data: data?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
