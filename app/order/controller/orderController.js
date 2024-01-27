import Order from "../model/orderModel.js";
import { Types } from "mongoose";
import OrderItem from "../model/orderItemSchema.js";
import CartItem from "../../cart/model/cartItemModel.js";
import Adress from "../../adress/model/adressModel.js";

export const insertOrder = async (req, res) => {
  try {
    const { deliveryFee, deliveryAdress } = req.body;

    // Find items in the user's cart
    const userId = req.user._id;
    console.log(userId);
    const items = await CartItem.find({ user: userId }).populate("product");

    // Check if the user has items in the cart
    if (!items || items.length === 0) {
      return res.json({
        error: 1,
        message:
          "You cannot create an order because you have no items in the cart",
      });
    }

    // Find delivery address
    const address = await Adress.findById(deliveryAdress);

    // Create a new order
    const order = new Order({
      _id: new Types.ObjectId(),
      status: "waiting_payment",
      deliveryFee: deliveryFee,
      deliveryAddress: {
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail,
      },
      user: userId,
    });

    // Create order items based on cart items
    const orderItems = await OrderItem.insertMany(
      items.map((item) => ({
        ...item,
        name: item.product.name,
        qty: parseInt(item.qty),
        price: parseInt(item.product.price),
        order: order._id,
        product: item.product._id,
      }))
    );

    orderItems.forEach((item) => order.orderItems.push(item));
    order.save();
    await CartItem.deleteMany({ user: userId });

    // You can do further processing or send a response as needed
    return res.json({ order, orderItems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrder = async (req, res, next) => {
  // const userId = req.user.id;

  try {
    let { skip = 0, limit = 10 } = req.query;
    let count = await Order.find().countDocuments();
    let orders = await Order.find()
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("orderItems")
      .sort("-createdAt");

    return res.json({
      data: orders.map((order) => order.toJSON({ virtuals: true })),
      count,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};
