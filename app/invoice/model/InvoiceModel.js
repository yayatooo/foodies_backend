import mongoose from "mongoose";
import { Schema } from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    subTotal: {
      type: Number,
      required: [true, "sub total harus diisi"],
    },
    deliveryFee: {
      type: Number,
      required: [true, "delivery fee harus diisi"],
    },
    adress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adress",
    },
    total: {
      type: Number,
      required: [true, "total harus diisi"],
    },
    paymentStatus: {
      type: String,
      enum: ["waiting_payment", "paid"],
      default: "waiting_payment",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
