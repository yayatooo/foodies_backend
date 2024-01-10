import express from "express";
import {
  addInvoice,
  getInvoice,
  getInvoiceById,
} from "../controller/invoiceController.js";

const invoiceRouter = express.Router();

invoiceRouter.post("/invoices", addInvoice);
invoiceRouter.get("/invoices", getInvoice);
invoiceRouter.post("/invoices/:id", getInvoiceById);

export default invoiceRouter;
