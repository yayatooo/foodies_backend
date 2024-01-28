import express from "express";
import { insertOrder, getOrder } from "../controller/orderController.js";
import decodeToken from "../../middlewares/index.js";

const orderRouter = express.Router();

orderRouter.post("/orders", insertOrder);
orderRouter.get("/orders", getOrder);

export default orderRouter;
