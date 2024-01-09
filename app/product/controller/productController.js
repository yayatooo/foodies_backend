import Product from "../model/productModel.js";
import Category from "../../categories/model/modelCategory.js";
import Tags from "../../tags/model/modelTags.js";
import mongoose from "mongoose";

export const insertProduct = async (req, res) => {
  const { name, desc, price, categoryName, tagNames } = req.body;
  const image = req.file.path;

  try {
    if (!categoryName) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    let newProduct = new Product({
      name,
      desc,
      price,
      image: req.file.filename,
      category: category._id,
    });

    if (tagNames && Array.isArray(tagNames) && tagNames.length > 0) {
      const tags = await Tags.find({ name: { $in: tagNames } });
      newProduct.tags = tags.map((tag) => tag._id);
    }

    const insertedProduct = await newProduct.save();

    const populatedProduct = await Product.populate(insertedProduct, [
      { path: "category" },
      { path: "tags" },
    ]);

    return res.status(201).json({
      message: "Product successfully inserted",
      product: populatedProduct,
    });
  } catch (error) {
    console.error("Error saving product:", error.message);
    return res.status(400).json({ error: error.message || "Bad Request" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, desc, price, categoryName } = req.body;
    const image = req.file;
    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    let category = null;

    if (categoryName) {
      category = await Category.findOne({ name: categoryName });

      // If the category doesn't exist, return an error
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        desc,
        price,
        image: "uploads/" + req.file.filename,
        category: category ? category._id : undefined,
      },
      { new: true }
    );

    if (updatedProduct) {
      return res.status(200).json({
        message: "Product successfully updated",
        product: updatedProduct,
      });
    }
  } catch (error) {
    console.error("Error updating product:", error.message);
    return res.status(400).json({ error: error.message || "Bad Request" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { category, tags, page = 1, pageSize = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const size = parseInt(pageSize, 10);

    if (isNaN(pageNumber) || isNaN(size) || pageNumber <= 0 || size <= 0) {
      return res
        .status(400)
        .json({ error: "Invalid page or pageSize parameters" });
    }

    const filterCriteria = {};

    if (category) {
      const categoryObject = await Category.findOne({ name: category });

      if (!categoryObject) {
        return res.status(404).json({ error: "Category not found" });
      }

      filterCriteria.category = categoryObject._id;
    }

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      const tagObjects = await Tag.find({ name: { $in: tagsArray } });
      filterCriteria.tags = { $in: tagObjects.map((tag) => tag._id) };
    }

    const skip = (pageNumber - 1) * size;
    const products = await Product.find(filterCriteria)
      .populate("category")
      .populate("tags")
      .skip(skip)
      .limit(size);

    const count = await Product.countDocuments(filterCriteria);

    res.send({ products, count, page: pageNumber, pageSize: size });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId)
      .populate("category")
      .populate("tags");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletedPrductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const deletedProduct = await Product.deleteOne({ _id: productId });

    if (deletedProduct.deletedCount > 0) {
      res.status(200).json({
        message: "Product successfully deleted",
        product: deletedProduct,
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
