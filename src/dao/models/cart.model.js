import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  cart: {
    type: {
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
    required: true,
  },
});

export const CartModel = mongoose.model("Cart", cartSchema);
