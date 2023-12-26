import express from "express";
// import Adress from "../model/adressModel.js";
import { policeCheck } from "../../middlewares/index.js";
import { insertAdress } from "../controller/adressController.js";
const routeAdress = express.Router();

routeAdress.get("/adress", (req, res) => {
  res.send({
    message: "tes",
  });
});

routeAdress.post("/adress", policeCheck("create", "Adress"), insertAdress);

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
