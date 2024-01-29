import Order from "../model/orderModel.js";
import { Types } from "mongoose";
import OrderItem from "../model/orderItemSchema.js";
import CartItem from "../../cart/model/cartItemModel.js";
import Adress from "../../adress/model/adressModel.js";

export const insertOrder = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;
    const deliveryFee = 10000;
    const userId = req.user._id;

    const items = await CartItem.find({ user: userId }).populate("product");

    if (!items || items.length === 0) {
      return res.json({
        error: 1,
        message:
          "You cannot create an order because you have no items in the cart",
      });
    }

    // console.log(deliveryAdress);
    // console.log(deliveryFee);
    // Find delivery address
    const address = await Adress.findById(deliveryAddress);
    console.log(address);

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

    // console.log(items);
    // Create order items based on cart items
    const orderItems = await OrderItem.insertMany(
      items.map((item) => ({
        ...item,
        name: item.name,
        price: parseInt(item.price),
        order: order._id,
        product: item._id,
        user: userId,
      }))
    );

    console.log(order);

    orderItems.forEach((item) => orderItems.push(item));
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
  try {
    let { skip = 0, limit = 10 } = req.query;
    let count = await Order.countDocuments();
    let orders = await Order.find()
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate({
        path: "orderItems", // Populate the orderItems field
        model: OrderItem, // Use the OrderItem model
      })
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
