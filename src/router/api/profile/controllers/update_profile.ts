import { Request, Response } from "express";
import ProfileSchema from "@/models/profile";

export const upadateCompany = async (req: Request, res: Response) => {
  const {
    IDNumber,
    firstName,
    expiryDate,
    issueDate,
    lastName,
    nationality,
    passportNumber,
    id,
  } = req.body as any;
  try {
    const profile = await ProfileSchema.findByIdAndUpdate(
      id,
      {
        $set: {
          IDNumber,
          firstName,
          expiryDate,
          issueDate,
          lastName,
          nationality,
          passportNumber,
        },
      },
      { new: true }
    );

    return res.status(200).json({ status: "ok", data: profile?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
