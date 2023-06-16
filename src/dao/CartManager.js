import { CartModel } from "./models/cart.model.js";

class CartManager {
  constructor() {
    this.collection = CartModel;
  }


  createCart = async () => {
    const newCart = new CartModel();
    try {
      await newCart.save();
      console.log(newCart._id)
      return newCart._id;

    } catch (error) {
      throw new Error("Error when trying to create a new cart!");
    }
  };

  addProductToCart = async (cartId, productId, quantity) => {
    const cart = await this.collection.findById(cartId);
    if (!cart) throw new Error("Cart does not exist!");
    try {
      let products = cart.cart.products || [];
      let productIndex = products.findIndex((elem) => elem.id === productId);
      if (productIndex !== -1) products[productIndex].quantity += quantity;
      else products.push({ id: productId, quantity });
      cart.cart.products = products;
      await cart.save();
    } catch (error) {
      throw new Error("Error when trying to add the product to the cart.");
    }
  };


  getCartById = async (cartId) => {
    const cart = await this.collection.findById(cartId);
    if (!cart) {
      throw new Error("Cart does not exist");
    }
    return cart;
  };
}

export const cartManager = new CartManager();
