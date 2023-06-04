import mongoose from "mongoose";
import { CartModel } from "./models/cart.model.js";

class CartManager {
  constructor() {
    this.counter = 0;
    this.collection = CartModel;
  }

createCart = async () => {
  const newCart = new CartModel({ cart: [] });
  try {
    const savedCart = await newCart.save();
    return savedCart._id; // Return the generated MongoDB _id
  } catch (error) {
    console.error("Error when trying to create a new cart:", error);
    throw new Error("Error when trying to create a new cart!");
  }
};


  addProductToCart = async (cartId, productId, quantity) => {
  const cart = await CartModel.findById(cartId);
  if (!cart) throw new Error("Cart does not exist!");

  try {
    let products = cart.cart.products || [];
    let productIndex = products.findIndex((elem) => elem.id === productId);
    if (productIndex !== -1) products[productIndex].quantity += quantity;
    else products.push({ id: productId, quantity });
    cart.cart.products = products;
    await cart.save();
  } catch (error) {
    console.error("Error when trying to add the product to the cart:", error);
    throw new Error("Error when trying to add the product to the cart.");
  }
};


  getCartById = async (id) => {
    const cart = await this.collection.findOne({ id });
    if (!cart) {
      throw new Error("Cart does not exist");
    }
    return cart;
  };
}

export const cartManager = new CartManager();
