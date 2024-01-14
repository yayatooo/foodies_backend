import { policyFor } from "../../utils/index.js";
import Adress from "../model/adressModel.js";
import { subject } from "@casl/ability";
// import User from "../../user/model/userModel.js";

export const insertAddress = async (req, res) => {
  const { name, kelurahan, kecamatan, kabupaten, provinsi } = req.body;

  const userId = req.user._id;
  try {
    const address = await Adress.create({
      name,
      kelurahan,
      kecamatan,
      kabupaten,
      provinsi,
      user: userId,
    });

    res.json({
      message: "Input Berhasil",
      address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAdress = async (req, res, next) => {
  try {
    let { _id, ...payload } = req.body;
    let { id } = req.params;
    let adress = await Adress.findById(id);
    let subjectAdress = subject("Adress", { ...adress, user_id: adress.user });
    let policy = policyFor.apply(req.user);
    if (!policy.can("update", subjectAdress)) {
      return res.send({
        error: 1,
        message: "you are not allowed to modify this adress",
      });
    }

    adress = await Adress.findByIdAndUpdate(id, payload, { new: true });
    res.send(adress);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
      });
    }
  }
};

export const getAdress = async (req, res) => {
  const userId = req.user._id;

  try {
    const adress = await Adress.find({ user: userId }).populate("user");
    res.send({
      status: "success",
      adress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getAdressById = async (req, res) => {
  const adressId = req.params.id;

  try {
    const adress = await Adress.findById(adressId);
    res.send({
      status: "success",
      adress,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteAdress = async (req, res) => {
  const adressId = req.params.id;
  try {
    const adress = await Adress.deleteOne({ _id: adressId });
    if (adress.deletedCount > 0) {
      res.status(200).json({
        message: "adress successfully deleted",
        product: adress,
      });
    } else {
      res.status(404).json({
        message: "Adress not found or not deleted",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
