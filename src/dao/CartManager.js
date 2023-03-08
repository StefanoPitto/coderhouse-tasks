import mongoose from "mongoose";
import { CartModel } from "./models/cart.model.js";

class CartManager {
  constructor() {
    this.counter = 0;
    this.collection = CartModel;
  }

  createCart = async () => {
    const newCart = new CartModel({ id: this.counter, cart: [] });
    try {
      await newCart.save();
    } catch (error) {
      throw new Error("Error when trying to create a new cart!");
    }
    this.counter++;
  };

  addProductToCart = async (cartId, productId, quantity) => {
    let id = parseInt(cartId);
    let pid = parseInt(productId);

    const cart = await this.collection.findOne({ id });
    if (!cart) throw new Error("Cart does not exist!");
    try {
      let products;
      cart._doc.cart.products
        ? (products = cart._doc.cart.products)
        : (products = new Array());
      let productIndex = products.findIndex((elem) => elem.id === pid);
      if (productIndex !== -1) products[productIndex].quantity += quantity;
      else products.push({ id: pid, quantity });
      const updatedCart = await this.collection.findOneAndUpdate(
        { id },
        { id, cart: { products } },
        { new: true }
      );
    } catch (error) {
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
