import Category from "../model/modelCategory.js";

export const insertCategory = async (req, res) => {
  const { name } = req.body;
  const newCategory = new Category({ name });
  try {
    const insertedCategory = await newCategory.save();
    res.status(200).json({
      message: "Category successfully inserted",
      product: insertedCategory,
    });
  } catch (error) {
    console.error("Error saving category:", error.message);
    return res.status(400).json({ error: error.message || "Bad Request" });
  }
};

export const updateCategory = async (req, res) => {
  const { name } = req.body;
  const categoryId = req.params.id;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true }
    );
    res.status(200).json({
      message: "Category successfully inserted",
      product: updatedCategory,
    });
  } catch (error) {
    console.error("Error saving category:", error.message);
    return res.status(400).json({ error: error.message || "Bad Request" });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.find({});
    res.send(category);
  } catch (error) {
    console.log(error);
  }
};
export const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findById(categoryId);
    res.send(category);
  } catch (error) {
    console.log(error);
  }
};
export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const deletedCategory = await Category.deleteOne({ _id: categoryId });

    if (deletedCategory.deletedCount > 0) {
      res.status(200).json({
        message: "Product successfully deleted",
        product: deletedCategory,
      });
    } else {
      res.status(404).json({
        message: "Product not found or not deleted",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
