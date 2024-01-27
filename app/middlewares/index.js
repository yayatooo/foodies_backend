import getToken from "../utils/index.js";
import jwt from "jsonwebtoken";
import { secretKey } from "../config.js";
import User from "../user/model/userModel.js";
import { policyFor } from "../utils/index.js";

export default function decodeToken() {
  return async function (req, res, next) {
    try {
      const token = getToken(req);

      if (!token) {
        return next();
      }

      const user = jwt.verify(token, secretKey);
      req.user = user;

      const userToken = await User.findOne(
        { token: { $in: [token] } },
        { new: true }
      );

      // console.log("isi :", token);
      if (!userToken) {
        return res.json({
          error: 1,
          message: "Token expired",
        });
      }

      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return res.status(401).json({
        error: 1,
        message: "Unauthorized",
      });
    }
  };
}

export const policeCheck = (action, subject) => {
  return function (req, res, next) {
    let policy = policyFor(req.user);
    if (!policy.can(action, subject)) {
      return res.json({
        error: 1,
        message: `You are not allowed to ${action} ${subject}`,
      });
      next();
    }
  };
};
