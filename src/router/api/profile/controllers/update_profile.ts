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
  } = req.body as any;
  const { id } = req.params || {};

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
    if (!profile)
      res.status(400).json({ status: 400, error: "Profile not found!" });

    return res.status(200).json({ status: "ok", data: profile?.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
