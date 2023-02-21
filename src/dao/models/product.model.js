import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    index: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    index: { unique: true },
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnails: {
    type: [String],
  },
});

export const ProductModel = mongoose.model("Product", productSchema);
