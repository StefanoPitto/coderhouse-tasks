import express from "express";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import { productsRouter } from "./routes/productsRoute.js";
import { cartRouter } from "./routes/cartsRoute.js";
import { manager } from "./dao/ProductManager.js";
import { MessageModel } from "./dao/models/message.model.js";
import { usersRouter } from "./routes/usersRoute.js";
import { sessionRouter } from "./routes/sessionRoute.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";

//Strategies

import "./passport/passport.js";

const app = express();

dotenv.config();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: process.env.DB_PASSWORD,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  }),
);
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

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

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/create-account", (req, res) => {
  res.render("createAccount");
});

app.get("/user-profile", (req, res) => {
  res.render("userProfile");
});

//Products ROUTE
app.use("/api/products", productsRouter);

//Carts ROUTE
app.use("/api/carts", cartRouter);

//Auth Route

app.use("/api/auth", usersRouter);

//Session Route

app.use("/api/session", sessionRouter);

//Lo mejor seria cambiar el puerto por una variable de entorno.

export const httpServer = app.listen(process.env.PORT, (req, res) =>
  console.log(`Server running on port ${process.env.PORT}`),
);

mongoose.set("strictQuery", true); // agregue esta linea ya que me tiraba un warning en consola.
mongoose
  .connect(process.env.DB_URL, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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

  socket.on("addProduct", async (product) => {
    try {
      manager.addProduct({ ...product, status: true });
      socket.emit("productsUpdated", await manager.getProducts());
    } catch (error) {
      console.log(error);
      socket.emit("error", error);
    }
  });

  socket.on("message", async (message) => {
    const newMessage = new MessageModel(message);
    await newMessage.save();
    const messagesArray = await MessageModel.find();
    s;
    socketServer.emit("messageUpdate", messagesArray);
  });

  socket.on("loadChatOnConnection", async () => {
    socket.emit("loadMessages", await MessageModel.find());
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
