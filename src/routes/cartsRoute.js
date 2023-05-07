import { Router } from "express";
import { check } from "express-validator";
import { cartManager } from "../dao/CartManager.js";
import { fieldsValidation } from "../middlewares/fieldsValidation.js";

export const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  try {
    await cartManager.createCart();
    res.statusCode = 200;
    res.json({ msg: "Cart created successfully" });
  } catch (error) {
    console.log("Error when adding a new cart");
  }
});

cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    let cart = await cartManager.getCartById(cid);
    res.statusCode = 200;
    res.json({ cart, msg: "Cart obtained successfully" });
  } catch (error) {
    error.statusCode = 404;
    console.log(error);
  }
});

cartRouter.post(
  "/:cid/products/:pid",
  [check("quantity").isNumeric(), fieldsValidation],
  async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      cartManager.addProductToCart(cid, pid, quantity);
      res.statusCode = 200;
      res.json({ msg: "Product added successfully to the cart" });
    } catch (error) {
      error.statusCode = 400;
      console.log(error);
    }
  },
);

cartRouter.post("/:cid/purchase", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await Cart.findOne({ id: cartId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    let totalPrice = 0;
    let productsToUpdateStock = [];

    for (let i = 0; i < cart.cart.products.length; i++) {
      const cartProduct = cart.cart.products[i];
      const product = await Product.findOne({ id: cartProduct.id });

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product with id ${cartProduct.id} not found` });
      }

      if (product.stock >= cartProduct.quantity) {
        totalPrice += product.price * cartProduct.quantity;
        productsToUpdateStock.push({
          id: product.id,
          quantity: cartProduct.quantity,
        });
      } else {
        return res.status(400).json({
          error: `Product with id ${product.id} does not have enough stock`,
        });
      }
    }

    for (let i = 0; i < productsToUpdateStock.length; i++) {
      const productToUpdate = productsToUpdateStock[i];
      await Product.updateOne(
        { id: productToUpdate.id },
        { $inc: { stock: -productToUpdate.quantity } },
      );
    }

    const ticket = new Ticket({
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: totalPrice,
      purchaser: cartId,
    });

    await ticket.save();

    await Cart.deleteOne({ id: cartId });

    return res.status(200).json({ message: "Purchase successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});
