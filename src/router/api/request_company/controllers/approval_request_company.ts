import { Request, Response } from "express";
import RequestCompanySchema from "@/models/request_company";

export const approvalRequestCompany = async (req: Request, res: Response) => {
  const { email } = req.query || {};
  console.log("email", email);

  try {
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
