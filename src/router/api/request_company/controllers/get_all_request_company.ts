import { Request, Response } from "express";
import RequestCompanySchema from "@/models/request_company";
import { pick } from "lodash";

export const getAllRequestCompany = async (req: Request, res: Response) => {
  const query = pick(req.query, ["status"]);
  try {
    const data = await RequestCompanySchema.find(query);
    return res.status(200).json({ status: "ok", data: data });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
