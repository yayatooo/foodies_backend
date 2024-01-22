import User from "../../user/model/userModel.js";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";
import { secretKey } from "../../config.js";
import getToken from "../../utils/index.js";

export const registerUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  console.log("Received Request Body:", req.body);

  try {
    const newUser = new User({ fullName, email, password, role });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const localStrategyUser = async (email, password, done) => {
  try {
    let user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt"
    );

    if (!user) {
      return done(null, false, { message: "Incorrect email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const { password, ...userWithoutPassword } = user.toJSON();
      return done(null, userWithoutPassword);
    } else {
      return done(null, false, { message: "Incorrect email or password" });
    }
  } catch (error) {
    return done(error, null);
  }
};

export const login = async (req, res, next) => {
  passport.authenticate("local", async function (err, user) {
    if (err) return next(err);
    if (!user)
      return res.json({ error: 1, message: "Email or password incorrect" });

    let signed = jwt.sign(user, secretKey);
    await User.findOneAndUpdate(
      user._id,
      { $push: { token: signed } },
      { new: false }
    );
    // await User.findByIdAndUpdate(user._id, { token: signed }, { new: false });

    res.json({
      message: "Login successful",
      user,
      token: signed,
    });
  })(req, res, next);
};

export const logout = async (req, res, next) => {
  try {
    const token = getToken(req);
    console.log("your token :", token);

    if (!token) {
      return res.json({
        error: 1,
        message: "No token provided",
      });
    }

    const user = await User.findOneAndUpdate(
      // { _id: req.user._id },
      { token: { $in: [token] } },
      { $pull: { token: token } },
      { useFindAndModify: false }
    );
    console.log("tes", user.token);
    // user.token;
    // const user = await User.findOne({ token: token });
    // console.log("Found user:", user);

    // console.log("tes :", user);

    if (!user) {
      return res.json({
        error: 1,
        message: "No user found",
      });
    }

    return res.json({
      error: 0,
      message: "Logout Berhasil",
    });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({
      error: 1,
      message: "Internal Server Error",
    });
  }
};

export const me = (req, res, next) => {
  if (!req.user) {
    res.json({
      error: 1,
      message: `You're not login or token expired`,
    });
  }
  res.json(req.user);
};
