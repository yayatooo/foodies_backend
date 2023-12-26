import express from "express";
import {
  localStrategyUser,
  registerUser,
  login,
  logout,
  me,
} from "../controller/authController.js";
import passport from "passport";
import localStrategy from "passport-local";

const routerAuth = express.Router();

passport.use(new localStrategy({ usernameField: "email" }, localStrategyUser));
routerAuth.post("/register", registerUser);
routerAuth.post("/login", login);
routerAuth.post("/logout", logout);
routerAuth.get("/me", me);
routerAuth.get("/login", (req, res) => {
  res.send({
    message: "tes",
  });
});
export default routerAuth;
