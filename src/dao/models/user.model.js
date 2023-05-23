import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
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
    enum: ["user", "admin",'premium'],
    default: "user",
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  passwordResetToken: String,
  passwordResetTokenExpiration: Date,
});

export const UserModel = mongoose.model("User", userSchema);
