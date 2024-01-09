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
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const route = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

route.post("/product", upload.single("image"), insertProduct);
route.patch("/product/:id", upload.single("image"), updateProduct);
route.get("/product", getProduct);
route.get("/product/:id", getProductById);
route.delete("/product/:id", deletedPrductById);

route.get("/image/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = join(__dirname, "uploads", filename);

  res.sendFile(imagePath);
});

export default route;
