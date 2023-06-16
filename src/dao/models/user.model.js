import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  documents: [
    {
      name: {
        type: String,
        required: true,
      },
      reference: {
        type: String,
        required: true,
      },
    },
  ],
  last_connection: {
    type: Date,
    default: Date.now,
  },
});

export const UserModel = mongoose.model("User", userSchema);
