import { Router } from "express";
import { manager } from "../dao/ProductManager.js";
import { check } from "express-validator";
import { verifyStringArray } from "../middlewares/verifyStringArray.js";
import { fieldsValidation } from "../middlewares/fieldsValidation.js";
import { socketServer } from "../app.js";
import { checkAdminRoutes } from "../middlewares/verifyAdmin.js";
import { generateProducts } from "../services/generateProducts.js";

export const productsRouter = Router();
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get products
 *     description: Retrieves a list of products based on the provided query parameters.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of products to limit the result.
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number for pagination.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting criteria for the products.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category filter for the products.
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter for the products.
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter for the products.
 *     responses:
 *       200:
 *         description: List of products.
 *       400:
 *         description: Error on request.
 */
productsRouter.get("/", async (req, res) => {
  const { limit, page, sort, category, minPrice, maxPrice } = req.query;
  try {
    const products = await manager.getProducts(
      limit,
      page,
      sort,
      category,
      minPrice,
      maxPrice,
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
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     description: Adds a new product with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product added successfully.
 *       409:
 *         description: The product already exists.
 */
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
  checkAdminRoutes,
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
  },
);

/**
 * @swagger
 * /products/mockingproducts:
 *   get:
 *     summary: Get mocked products
 *     description: Retrieves a list of mocked products for testing purposes.
 *     responses:
 *       200:
 *         description: List of mocked products.
 *       400:
 *         description: Error occurred when generating mocked products.
 */
productsRouter.get("/mockingproducts", async (req, res) => {
  try {
    const products = await generateProducts();
    return res.status(200).json({ products });
  } catch (err) {
    console.log(err, "ERROR");
    return res.status(400).json(err);
  }
});
/**
 * @swagger
 * /products/{pid}:
 *   put:
 *     summary: Update a product
 *     description: Updates the details of the specified product.
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       404:
 *         description: Product not found.
 */
productsRouter.put("/:pid", checkAdminRoutes, async (req, res) => {
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
/**
 * @swagger
 * /products/{pid}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes the specified product.
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       404:
 *         description: An error occurred when trying to delete the product.
 */
productsRouter.delete("/:pid", checkAdminRoutes, async (req, res) => {
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
/**
 * @swagger
 * /products/{pid}:
 *   get:
 *     summary: Get a product
 *     description: Retrieves the details of the specified product.
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details.
 *       400:
 *         description: Error when trying to get the product.
 */
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
