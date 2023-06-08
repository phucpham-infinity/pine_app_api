import { Request, Response } from "express";
import RequestAccountSchema from "@/models/request_account";
import { pick } from "lodash";

export const getAllRequestAccount = async (req: Request, res: Response) => {
  const query = pick(req.query, ["status"]);
  try {
    const data = await RequestAccountSchema.find(query);
    return res.status(200).json({ status: "ok", data: data });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
