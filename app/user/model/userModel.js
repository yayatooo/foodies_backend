import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Nama Harus diisi"],
      maxlength: [255, "Panjang nama minimal 3 - 255 karakter"],
      minlength: [3, "Panjang nama minimal 3 - 255 karakter"],
    },
    customerId: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "Email Harus diisi"],
      maxlength: [255, "Panjang nama maksimal 255 karakter"],
    },
    password: {
      type: String,
      required: [true, "Password Harus diisi"],
      maxlength: [255, "Panjang Password maksimal 255 karakter"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    token: [String],
    // token: { type: String },
  },
  { timestamps: true }
);

userSchema.path("email").validate(function (email) {
  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return email && emailRegex.test(email);
}, "The e-mail field is not valid.");

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

// const HASH_ROUND = 10;
// userSchema.pre("save", function (next) {
//   this.password = bcrypt.hashSync(this.password, HASH_ROUND);
//   next();
// });

const User = mongoose.model("user", userSchema);

export default User;
