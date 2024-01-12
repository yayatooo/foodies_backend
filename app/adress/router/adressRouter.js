import express from "express";
// import Adress from "../model/adressModel.js";
import { policeCheck } from "../../middlewares/index.js";
import {
  insertAdress,
  updateAdress,
  getAdress,
  getAdressById,
  deleteAdress,
} from "../controller/adressController.js";
const routeAdress = express.Router();

routeAdress.post("/adress", insertAdress);
routeAdress.put("/adress", updateAdress);
routeAdress.get("/adress", getAdress);
routeAdress.get("/adress/:id", getAdressById);
routeAdress.delete("/adress/:id", deleteAdress);

// routeAdress.post("/adress", async (req, res) => {
//   try {
//     const payload = req.body;
//     // const user = req.user;
//     const adress = new Adress({ ...payload });
//     await adress.save();
//     return res.send(adress);
//   } catch (error) {
//     console.log(error);
//   }
// });

export default routeAdress;
