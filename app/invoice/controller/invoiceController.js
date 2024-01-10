import Invoice from "../model/InvoiceModel";
import Order from "../../order/model/orderModel";

export const addInvoice = async (req, res, next) => {
  try {
    const { user, order, subTotal, deliveryFee, total, deliveryAdress } =
      req.body;
    const orderReady = await Order.findById(order);
    if (!orderReady) {
      return res.status(401).json({ msg: "Order not found" });
    }

    const newInvoice = new Invoice({
      user,
      order,
      subTotal,
      deliveryFee,
      total,
      deliveryAdress,
    });

    await newInvoice.save();
    res.status(200).json(newInvoice);
  } catch (error) {
    console.log("Error in Add Invoice Controller", error);
  }
};

export const getInvoice = async (req, res, next) => {
  try {
    const invoices = await Invoice.find().populate("order");
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error in getInvoice Controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    const invoiceId = req.params.id;
    const invoice = await Invoice.findById(invoiceId).populate("order");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error in getInvoiceById Controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
