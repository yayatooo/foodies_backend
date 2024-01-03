import express from "express";
// import { policeCheck } from "../../middlewares/index.js";
import {
  getTags,
  getTagsById,
  insertTags,
  updateTags,
  deleteTags,
} from "../controller/controllerTags.js";

const routerTags = express.Router();

routerTags.post("/tags", insertTags);
routerTags.get("/tags", getTags);
routerTags.get("/tags/:id", getTagsById);
routerTags.patch("/tags/:id", updateTags);
routerTags.delete("/tags/:id", deleteTags);

export default routerTags;
