import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, "Minimal Nama 3 character"],
      required: [true, "nama harus diisi"],
    },

    desc: {
      type: String,
      maxlength: [1000, "Minimal Penulisan berupa 1000 character"],
    },

    price: {
      type: Number,
      default: 0,
      required: true,
    },

    image: String,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tags",
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);

export default Product;
