import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      index: true
    },

    description: {
      type: String,
      required: [true, "Product description is required"]
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
      index: true
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

productSchema.index({ name: "text", category: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;