import express from "express";
import { policeCheck } from "../../middlewares/index.js";
import {
  insertCategory,
  updateCategory,
  getCategory,
  getCategoryById,
  deleteCategory,
} from "../controller/controllerCategory.js";

const routerCategory = express.Router();

routerCategory.post(
  "/category",
  policeCheck("create", "Categories"),
  insertCategory
);
routerCategory.patch(
  "/category/:id",
  policeCheck("update", "Categories"),
  updateCategory
);
routerCategory.get("/category/:id", getCategoryById);
routerCategory.delete(
  "/category/:id",
  policeCheck("delete", "Categories"),
  deleteCategory
);
routerCategory.get("/category", getCategory);

export default routerCategory;
