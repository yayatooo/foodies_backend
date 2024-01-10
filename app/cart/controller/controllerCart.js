import Product from "../../product/model/productModel.js";
import CartItem from "../model/cartItemModel.js";

export const updateCart = async (req, res, next) => {
  try {
    const { items } = req.body;

    const productIds = items.map((item) => item.product._id);
    const products = await Product.find({ _id: { $in: productIds } });

    const cartItems = items.map((item) => {
      const relatedProduct = products.find(
        (product) => product._id.toString() === item.product._id
      );
      return {
        product: relatedProduct._id,
        price: relatedProduct.price,
        image: relatedProduct.image,
        name: relatedProduct.name,
        user: req.user._id,
        qty: item.qty,
      };
    });
    await CartItem.deleteMany({ user: req.user._id });

    await CartItem.bulkWrite(
      cartItems.map((item) => ({
        updateOne: {
          filter: { user: req.user._id, product: item.product },
          update: item,
          upsert: true,
        },
      }))
    );

    return res.json(cartItems);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getItemCart = async (req, res, next) => {
  try {
    let items = await CartItem.find().populate("user").populate("product");
    return res.send(items);
  } catch (error) {
    res.json({
      err: 1,
      message: error.message,
    });
    next(error);
  }
};

export const getItemCartById = async (req, res, next) => {
  try {
    let userId = req.params._id;
    let items = await CartItem.findById({ user: userId })
      .populate("user")
      .populate("product");
    return res.send(items);
  } catch (error) {
    res.json({
      err: 1,
      message: error.message,
    });
    next(error);
  }
};

export const addCart = async (req, res, next) => {
  const { name, qty, price, image, user, product } = req.body;

  try {
    const cart = new CartItem({
      name,
      qty,
      price,
      image,
      user,
      product,
    });

    const newCart = await cart.save();

    res.status(200).send({ message: "Cart Item Berhasil", data: newCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const removeUserCart = async (req, res, next) => {
  const userId = req.params.userId;
  const cartId = req.params.id;

  try {
    const result = await CartItem.deletOne({ user: userId, _id: cartId });

    if (result.deletedCount > 0) {
      res.status(200).send({ message: "User's cart items berhasil dihapus" });
    } else {
      res.status(404).send({ message: "User's cart items tidak ditemukan" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const clearUserCart = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const result = await CartItem.deletOne({ user: userId });

    if (result.deletedCount > 0) {
      res.status(200).send({ message: "User's cart items berhasil dihapus" });
    } else {
      res.status(404).send({ message: "User's cart items tidak ditemukan" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const decrease = async (req, res) => {
  try {
    const { userId, id: cartId } = req.params;

    const cart = await Cart.findOne({ user: userId, _id: cartId });

    if (!cart) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (cart.qty > 1) {
      cart.qty -= 1;
      const updatedCart = await cart.save();
      return res.status(200).json(updatedCart);
    }

    await Cart.deleteOne({ user: userId, _id: cartId });
    res
      .status(201)
      .json({ message: "Keranjang berhasil dikurangi", data: cartId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const increase = async (req, res) => {
  try {
    const { userId, id: cartId } = req.params;

    const cart = await Cart.findOne({ user: userId, _id: cartId });

    if (!cart) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.qty += 1;
    const updatedCart = await cart.save();

    res.status(200).json(updatedCart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const increaseByQty = async (req, res) => {
  try {
    const { userId, id: cartId } = req.params;
    const { qty } = req.body;

    const cart = await CartItem.findOne({ user: userId, _id: cartId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Item tidak ada dalam keranjang" });
    }

    const parsedQty = parseInt(qty);

    if (!Number.isInteger(parsedQty) || parsedQty <= 0) {
      return res.status(400).json({ message: "Invalid quantity to add" });
    }

    cart.qty += parsedQty;
    const updatedCart = await cart.save();

    res.status(200).json(updatedCart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
