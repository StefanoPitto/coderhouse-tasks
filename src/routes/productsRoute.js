import { Router } from "express";
import { manager } from "../dao/ProductManager.js";
import { check } from "express-validator";
import { verifyStringArray } from "../middlewares/verifyStringArray.js";
import { fieldsValidation } from "../middlewares/fieldsValidation.js";
import { socketServer } from "../app.js";

export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  const { limit, page, sort, category, minPrice, maxPrice } = req.query;
  try {
    const products = await manager.getProducts(
      limit,
      page,
      sort,
      category,
      minPrice,
      maxPrice
    );
    if (limit) res.send(products.slice(0, limit));
    else res.send(products);
  } catch (error) {
    const errorMessage = Array.isArray(error)
      ? error.join("")
      : error.toString();
    res.status(400).json({
      msg: "Error on request!",
      error: errorMessage,
    });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await manager.getProductById(parseInt(pid));
    if (product) res.send(product);
    else res.send("Product does not exist.");
  } catch (error) {
    res.status(400).json({
      msg: "Error when trying to get the products",
    });
  }
});

productsRouter.post(
  "/",
  [
    check("title").notEmpty().isString(),
    check("description").notEmpty().isString(),
    check("code").notEmpty().isString(),
    check("price").notEmpty().isNumeric(),
    check("stock").notEmpty().isNumeric(),
    check("status").notEmpty().isBoolean(),
    check("category").notEmpty().isString(),
    fieldsValidation,
  ],
  verifyStringArray,
  async (req, res) => {
    const {
      title,
      description,
      code,
      price,
      stock,
      status,
      category,
      thumbnail,
    } = req.body;
    console.log("body", req.body);
    try {
      await manager.addProduct({
        title,
        description,
        code,
        price,
        stock,
        status,
        category,
        thumbnail,
      });
      res.statusCode = 200;
      res.json({ msg: "Product was added successfully." });
    } catch (error) {
      res.status(409).send("The product already exists.");
    }
    socketServer.emit("productUpdate", await manager.getProducts());
  }
);

productsRouter.put("/:pid", async (req, res) => {
  const product = req.body;
  const id = req.params.pid;
  try {
    await manager.updateProduct(id, product);
  } catch (error) {
    error.statusCode = 404;
    console.log(error);
  }
  res.statusCode = 200;
  res.json({ msg: "Product updated successfully." });
});

productsRouter.delete("/:pid", async (req, res) => {
  const id = req.params.pid;
  try {
    await manager.deleteProduct(id);
    res.statusCode = 200;
    res.json({ msg: "Product deleted successfully." });
  } catch (error) {
    res
      .status(404)
      .send("An error ocurred when trying to delete the product. ");
  }
  socketServer.emit("productUpdate", await manager.getProducts());
});
