import Adress from "../model/adressModel.js";
// import User from '../../user/model/userModel.js'

export const insertAdress = async (req, res) => {
  try {
    const payload = req.body;
    const user = req.user;
    const adress = new Adress({ ...payload, user: user._id });
    await adress.save();
    return res.send(adress);
  } catch (error) {
    console.log(error);
  }
};
