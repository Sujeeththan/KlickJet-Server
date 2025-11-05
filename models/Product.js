import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
      unique: true,
    },
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    in_stock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
