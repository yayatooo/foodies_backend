import mongoose from "mongoose";
const { Schema } = mongoose;

const adressSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, "Minimal Nama 3 character"],
      maxlength: [255, "maksimal Nama 255 character"],
      required: [true, "nama harus diisi"],
    },

    kelurahan: {
      type: String,
      maxlength: [255, "maksimal kelurahan 255 character"],
      required: [true, "kelurahan harus diisi"],
    },

    kecamatan: {
      type: String,
      maxlength: [255, "maksimal kecamatan 255 character"],
      required: [true, "kecamatan harus diisi"],
    },
    kabupaten: {
      type: String,
      maxlength: [255, "maksimal kabupaten 255 character"],
      required: [true, "kabupaten harus diisi"],
    },
    provinsi: {
      type: String,
      maxlength: [255, "maksimal provinsi 255 character"],
      required: [true, "provinsi harus diisi"],
    },

    user: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Adress = mongoose.model("adress", adressSchema);
export default Adress;
