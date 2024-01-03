import express from "express";
// import { policeCheck } from "../../middlewares/index.js";
import {
  insertCategory,
  updateCategory,
  getCategory,
  getCategoryById,
  deleteCategory,
} from "../controller/controllerCategory.js";

const routerCategory = express.Router();

routerCategory.post("/category", insertCategory);
routerCategory.patch("/category/:id", updateCategory);
routerCategory.get("/category/:id", getCategoryById);
routerCategory.delete("/category/:id", deleteCategory);
routerCategory.get("/category", getCategory);

export default routerCategory;
