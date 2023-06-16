import { Request, Response } from "express";

import InvoiceSchema from "@/models/invoice";
import { isEmpty } from "lodash";

export const createInvoiceTransaction = async (req: Request, res: Response) => {
  const { invoiceNumber } = req.body as any;
  try {
    const dataInvoice = await InvoiceSchema.findOne({ invoiceNumber });

    if (isEmpty(dataInvoice))
      return res.status(400).json({ status: 400, error: "Invoice not found!" });
    return res.status(200).json({
      status: "ok",
    });
  } catch (error) {
    return res.status(400).json({ status: 400, error: JSON.stringify(error) });
  }
};
