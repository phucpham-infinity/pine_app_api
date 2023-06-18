import { Request, Response } from "express";

import InvoiceSchema from "@/models/invoice";
import { isEmpty } from "lodash";
import PDFDocument from "pdfkit";

export const createInvoicePdf = async (req: Request, res: Response) => {
  const { invoiceNumber } = req.params as any;
  try {
    const dataInvoice = await InvoiceSchema.findOne({ invoiceNumber });
    if (isEmpty(dataInvoice))
      return res.status(400).json({ status: 400, error: "Invoice not found!" });

    const doc = new PDFDocument();

    doc.pipe(res);
    doc.fontSize(18).text("INVOICE", { align: "center" });

    doc.fontSize(12).text(`Invoice Number: ${invoiceNumber}`);
    doc.fontSize(12).text(`Name: ${dataInvoice.recipientName}`);
    doc.fontSize(12).text(`Phone: ${dataInvoice.recipientPhone}`);
    doc.fontSize(12).text(`Email: ${dataInvoice.recipientEmail}`);
    doc.fontSize(12).text(`Amount: AED ${dataInvoice.detailAmount}`);
    doc.fontSize(12).text(`Due Date: ${dataInvoice.detailDueDate}`);
    doc.fontSize(12).text(`Description: ${dataInvoice.detailType}`);

    doc.end();
  } catch (error) {
    return res.status(400).json({ status: 400, error: JSON.stringify(error) });
  }
};
