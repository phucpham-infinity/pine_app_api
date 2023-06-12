import { Request, Response } from "express";
import UserCompanyRefSchema from "@/models/user_company_ref";

export const joinCompany = async (req: Request, res: Response) => {
  const { companyId } = req.query || {};
  const { _id } = req.user || {};

  try {
    const refData = await UserCompanyRefSchema.findOne({ userId: _id });
    if (refData) {
      const newRefData = await UserCompanyRefSchema.findOneAndUpdate(
        { userId: _id },
        {
          $set: {
            companyId,
          },
        },
        { new: true }
      );
      return res.status(200).json({ status: "ok", data: newRefData?.doc() });
    }
    const newData = new UserCompanyRefSchema({
      userId: _id,
      companyId,
    });
    const dataNew = await newData.save();
    return res.status(200).json({ status: "ok", data: dataNew?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
