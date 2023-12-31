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
    let items = await CartItem.find({ user: req.user._id }).populate("product");
    return res.send(items);
  } catch (error) {
    res.json({
      err: 1,
      message: error.message,
    });
    next(error);
  }
};
