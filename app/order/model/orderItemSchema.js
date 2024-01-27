import mongoose from "mongoose";
import { Schema } from "mongoose";

const orderItemScheema = Schema(
  {
    name: {
      type: String,
      required: [true, "nama harus diisi"],
      minlength: [3, "minimal panjang nama makanan 30 karakter"],
    },
    price: {
      type: Number,
      required: [true, "harga harus diisi"],
    },
    qty: {
      type: Number,
      required: [true, "kuantitas harus diisi"],
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    // order: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Order",
    // },
  },
  { timestamps: true }
);

const OrderItem = mongoose.model("OrderItem", orderItemScheema);

export default OrderItem;
