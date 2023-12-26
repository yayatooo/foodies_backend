import express from "express";
const cartRouter = express.Router();

cartRouter.get("/cart", (req, res) => {
  res.send({
    message: "tes kriuk",
  });
});

export default cartRouter;
