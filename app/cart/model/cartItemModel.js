import monngoose from "mongoose";
import { model, Schema } from "mongoose";

const cartItemSchema = Schema({
  name: {
    type: String,
    required: [true, "nama harus diisi"],
    minlength: [5, "Panjang nama makanan minimal 50 karakter"],
  },

  qty: {
    type: Number,
    required: [true, "quantity harus diisi"],
    min: [1, "minimal quantity adala 1"],
  },

  price: {
    type: Number,
    default: 0,
  },

  image: String,

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

const CartItem = monngoose.model("cartItem", cartItemSchema);

export default CartItem;
