import express from "express";
import { insertOrder, getOrder } from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/orders", insertOrder);
orderRouter.get("/orders", getOrder);

export default orderRouter;
