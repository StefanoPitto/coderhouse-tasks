const express = require("express");
const ProductManager = require("./ProductManager");

const app = express();
const manager = ProductManager.manager;
app.get("/products", async (req, res) => {
  const { limit } = req.query;
  const products = await manager.getProducts();
  if (limit) res.send(products.slice(0, limit));
  else res.send(products);
});

app.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;

  const product = await manager.getProductById(parseInt(pid));
  if (product) res.send(product);
  else res.send("Product does not exist.");
});

//Lo mejor seria cambiar el puerto por una variable de entorno.

app.listen(8080, (req, res) => console.log("Server running on port 8080"));
