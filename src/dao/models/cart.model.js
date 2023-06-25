import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  cart: [{
    id: {
      type: String,
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  }],
});

export const CartModel = mongoose.model("Cart", cartSchema);
