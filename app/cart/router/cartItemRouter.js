import express from "express";
import {
  updateCart,
  getItemCart,
  addCart,
  increase,
  decrease,
  increaseByQty,
  clearUserCart,
  getItemCartById,
  removeUserCart,
  removeCart,
} from "../controller/controllerCart.js";
const cartItemRouter = express.Router();

cartItemRouter.put("/carts", updateCart);
cartItemRouter.get("/carts", getItemCart);
cartItemRouter.post("/carts", addCart);
cartItemRouter.patch("/carts/:userId/:id/decrease", decrease);
cartItemRouter.patch("/carts/:userId/:id/increase", increase);
cartItemRouter.post("/carts/:userId/:id/increase/:qty", increaseByQty);
// cartItemRouter.delete("/carts/:userId/:id/", removeUserCart);
// cartItemRouter.delete("/carts/:userId", clearUserCart);
cartItemRouter.delete("/carts/:id", removeCart);
cartItemRouter.get("/carts/:id", getItemCartById);

export default cartItemRouter;
