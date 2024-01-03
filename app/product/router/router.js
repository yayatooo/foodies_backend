import express from "express";
// import { policeCheck } from "../../middlewares/index.js";
import {
  insertProduct,
  getProduct,
  getProductById,
  deletedPrductById,
  updateProduct,
} from "../controller/productController.js";
import multer from "multer";

const route = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

route.post("/product", upload.single("image"), insertProduct);
route.patch("/product/:id", upload.single("image"), updateProduct);
route.get("/product", getProduct);
route.get("/product/:id", getProductById);
route.delete("/product/:id", deletedPrductById);

export default route;
