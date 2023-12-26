import express from "express";
import { policeCheck } from "../../middlewares/index.js";
import {
  getTags,
  getTagsById,
  insertTags,
  updateTags,
  deleteTags,
} from "../controller/controllerTags.js";

const routerTags = express.Router();

routerTags.post("/tags", policeCheck("create", "Tag"), insertTags);
routerTags.get("/tags", getTags);
routerTags.get("/tags/:id", getTagsById);
routerTags.patch("/tags/:id", policeCheck("update", "Tag"), updateTags);
routerTags.delete("/tags/:id", policeCheck("delete", "Tag"), deleteTags);

export default routerTags;
