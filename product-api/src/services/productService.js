import Product from "../models/Product.js";

export const createProductService = async (productData, userId) => {
  const { name, description, category, price, stock } = productData;

  if (!name || !description || !category || price === undefined) {
    throw new Error("Name, description, category and price are required");
  }

  const product = await Product.create({
    name,
    description,
    category,
    price,
    stock,
    createdBy: userId
  });

  return product;
};

export const getProductsService = async () => {
  return await Product.find()
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });
};

export const getProductByIdService = async (productId) => {
  const product = await Product.findById(productId).populate(
    "createdBy",
    "name email role"
  );

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const updateProductService = async (productId, updateData) => {
  const product = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const deleteProductService = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};