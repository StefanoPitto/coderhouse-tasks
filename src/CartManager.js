const express = require("express");
const fs = require("fs");
const path = "./src/assets/carts.json";

class CartManager {
  constructor() {
    path.length === 0
      ? (this.path = "./src/assets/carts.json")
      : (this.path = path);
    this.counter = 0;
    if (fs.existsSync(this.path)) {
      fs.readFileSync(this.path).length > 0
        ? (this.carts = JSON.parse(fs.readFileSync(this.path)))
        : (this.carts = []);
    } else {
      this.carts = [];
    }
  }

  createCart = () => {
    this.carts.push({ id: this.counter, products: [] });
    this.updateFile();
    this.counter++;
  };

  addProductToCart = (cartId, productId, quantity) => {
    let cart =
      this.carts[
        this.carts.findIndex((cart) => cart.id === parseFloat(cartId))
      ];
    if (!cart) {
      throw new Error("The requested cart does not exist.");
    }
    let productIndex = cart.products.findIndex((elem) => elem.id === productId);
    if (productIndex !== -1) cart.products[productIndex].quantity += quantity;
    else cart.products.push({ id: productId, quantity });
    this.updateFile();
  };

  getCartById = (id) => {
    let toReturn = this.carts.find((elem) => elem.id === parseFloat(id));
    if (!toReturn) throw new Error("Error! Cart does not exist");
    return toReturn;
  };
  updateFile = () => {
    fs.writeFileSync(this.path, JSON.stringify(this.carts));
  };
}

cartManager = new CartManager();

module.exports = { cartManager };
