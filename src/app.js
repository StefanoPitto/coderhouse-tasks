const { urlencoded } = require("express");
const express = require("express");
const ProductManager = require("./ProductManager");

const app = express();

app.use(express.json());
//Products ROUTE
app.use("/api/products", require("./routes/productsRoute"));

//Carts ROUTE
app.use("/api/carts", require("./routes/cartsRoute"));

//Lo mejor seria cambiar el puerto por una variable de entorno.

app.listen(8080, (req, res) => console.log("Server running on port 8080"));
