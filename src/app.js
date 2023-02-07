import express from "express";
import { json, urlencoded } from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import { productsRouter } from "./routes/productsRoute.js";
import { cartRouter } from "./routes/cartsRoute.js";
import { manager } from "./ProductManager.js";
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  res.render("products", {});
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

//Products ROUTE
app.use("/api/products", productsRouter);

//Carts ROUTE
app.use("/api/carts", cartRouter);

//Lo mejor seria cambiar el puerto por una variable de entorno.

export const httpServer = app.listen(8080, (req, res) =>
  console.log("Server running on port 8080")
);

//Socket

export const socketServer = new Server(httpServer);

socketServer.on("connection", () => {
  console.log("User connection");

  socketServer.emit("Products", manager.getProducts());

  socketServer.on("disconnect", () => {
    console.log("User disconnected");
  });
});

socketServer.on("product", (products) => {
  socketServer.emit("newProduct", products);
});
