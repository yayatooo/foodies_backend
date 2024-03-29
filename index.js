import express from "express";
import cors from "cors";
import route from "./app/product/router/router.js";
import mongoose from "mongoose";
import routerCategory from "./app/categories/router/routerCategories.js";
import routerTags from "./app/tags/router/routerTags.js";
import routerAuth from "./app/auth/router/authRouter.js";
import routeAdress from "./app/adress/router/adressRouter.js";
import cartItemRouter from "./app/cart/router/cartItemRouter.js";
import orderRouter from "./app/order/router/orderRouter.js";
import decodeToken from "./app/middlewares/index.js";
import invoiceRouter from "./app/invoice/router/invoiceRouter.js";
import policeCheck from "./app/middlewares/index.js";
const app = express();
const port = 3000;

const url = "mongodb://127.0.0.1:27017/foodies";
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
app.use(decodeToken());
app.use(policeCheck());
app.use(routeAdress);
app.use(route);
app.use(routerCategory);
app.use(routerTags);
app.use(cartItemRouter);
app.use(invoiceRouter);
app.use(orderRouter);
app.use(routerAuth);
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
