import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  cart: {
    type: Object,
    required: true,
    products: [
      {
        id: {
          type: Number,
          required: true,
          index: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

export const CartModel = mongoose.model("Cart", cartSchema);
