import express from "express";
import { json, urlencoded } from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import { productsRouter } from "./routes/productsRoute.js";
import { cartRouter } from "./routes/cartsRoute.js";
import { manager } from "./dao/ProductManager.js";
import { MessageModel } from "./dao/models/message.model.js";

import mongoose from "mongoose";
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

app.get("/chat", (req, res) => {
  res.render("chat");
});

//Products ROUTE
app.use("/api/products", productsRouter);

//Carts ROUTE
app.use("/api/carts", cartRouter);

//Lo mejor seria cambiar el puerto por una variable de entorno.

export const httpServer = app.listen(8080, (req, res) =>
  console.log("Server running on port 8080")
);

//Connect to the DB

const password = "jbRjmQdINhx6mkMy"; //Deberia ir en un .env
const dbName = "ecommerce";

mongoose.set("strictQuery", true); // agregue esta linea ya que me tiraba un warning en consola.
mongoose
  .connect(
    `mongodb+srv://stefanopitto1:${password}@cluster0.vujisoj.mongodb.net/test`,
    { dbName, useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to the DB"))
  .catch((e) => console.log("Error on connection to the DB", e));

//Socket

export const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("User connection");

  socket.on("loadProductsOnConnection", async () => {
    let products = [];
    try {
      products = await manager.getProducts();
    } catch (error) {
      console.log(error);
    }
    socket.emit("products", products);
  });
  socket.on("product", (products) => {
    socketServer.emit("newProduct", products);
  });

  socket.on("message", async (message) => {
    const newMessage = new MessageModel(message);
    await newMessage.save();
    const messagesArray = await MessageModel.find();
    socketServer.emit("messageUpdate", messagesArray);
  });

  socket.on("loadChatOnConnection", async () => {
    socket.emit("loadMessages", await MessageModel.find());
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
