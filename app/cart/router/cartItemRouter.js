import express from "express";
import { updateCart, getItemCart } from "../controller/controllerCart.js";
import { policeCheck } from "../../middlewares/index.js";
const cartItemRouter = express.Router();

cartItemRouter.put("/carts", policeCheck("update", "Cart"), updateCart);
cartItemRouter.get("/carts", getItemCart);

export default cartItemRouter;
