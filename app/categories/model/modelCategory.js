import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama harus diisi"],
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
