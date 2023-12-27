import mongoose from "mongoose";
import { Schema } from "mongoose";
import Inc from "mongoose-sequence";
import Invoice from "../../invoice/model/InvoiceModel.js;";

const AutoIncrement = Inc(mongoose);

const orderScheema = Schema(
  {
    status: {
      type: String,
      enum: ["waiting_payment", "processing", "in_delivery", "delivered"],
      default: "waiting_payment",
    },

    deliveryFee: {
      type: Number,
      default: 0,
    },
    deliveryAdress: {
      provinsi: { type: String, required: [true, "provinsi harus diisi"] },
      kabupaten: { type: String, required: [true, "kabupaten harus diisi"] },
      kecamatan: { type: String, required: [true, "kecamatan harus diisi"] },
      kelurahan: { type: String, required: [true, "kelurahan harus diisi"] },
      detal: { type: String },
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    orderItems: {
      type: Schema.Types.ObjectId,
      ref: "OrderItem",
    },
  },
  { timestamps: true }
);

orderScheema.plugin(AutoIncrement, { IncField: "orderNumber" });
orderScheema.virtual("itemsCount").get(function () {
  return this.orderItems.reduce((total, item) => total + parseInt(item.qty), 0);
});

orderScheema.post("save", async function () {
  let subTotal = this.orderItems.reduce(
    (total, item) => total + parseInt(item.qty),
    0
  );
  let invoice = new Invoice({
    user: this.user,
    order: this._id,
    subTotal: subTotal,
    deliveryFee: parseInt(this.deliveryFee),
    total: parseInt(subTotal + this.deliveryFee),
    deliveryAdress: this.deliveryAdress,
  });
  await invoice.save();
});

const Order = mongoose.model("Order", orderScheema);

export default Order;
