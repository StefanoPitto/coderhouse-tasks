const { Router } = require("express");

const { check } = require("express-validator");

const { cartManager } = require("../CartManager");
const { fieldsValidation } = require("../middlewares/fieldsValidation");

const router = Router();

router.post("/", async (req, res) => {
  await cartManager.createCart();
  res.statusCode = 200;
  res.json({ msg: "Cart created successfully" });
});

router.get("/:cid", async (req, res) => {
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

router.post(
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
  }
);
module.exports = router;
