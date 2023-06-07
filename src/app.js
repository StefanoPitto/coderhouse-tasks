//App
import express from "express";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "express";
import { __dirname } from "./utils.js";
import dotenv from "dotenv";

//WebSockets
import { Server } from "socket.io";

//Routes
import { productsRouter } from "./routes/cartRouter/productsRouter/productsRoute.js";
import { cartRouter } from "./routes/cartRouter/cartsRoute.js";
import { usersRouter } from "./routes/usersRouter/usersRoute.js";
import { sessionRouter } from "./routes/sessionRouter/sessionRoute.js";

//Views
import { engine } from "express-handlebars";

//Managers
import { manager } from "./dao/ProductManager.js";
import { MessageModel } from "./dao/models/message.model.js";

//Session
import session from "express-session";
import sharedsession from "express-socket.io-session";

//Mongo DB
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";

//Strategies
import "./passport/passport.js";
import { checkUserSocket } from "./middlewares/verifyUser.js";
import { checkAdminSocket } from "./middlewares/verifyAdmin.js";


//Documentation 
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "./swagger/swaggerConfig.js";

const app = express();

dotenv.config();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const sessionMiddleware = session({
  secret: process.env.DB_PASSWORD,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
  }),
});

app.use(sessionMiddleware);
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

// Serve Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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

app.get("/catalog", (req, res) => {
  res.render("catalog");
});

app.get("/recover-password", (req,res)=>{
  res.render('recoverPassword');
});

app.get("/token",(req,res)=>{
  res.render('token');
})

app.get("/change-password",(req,res)=>{
  res.render('changePassword');
})


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
socketServer.use(sharedsession(sessionMiddleware, { autoSave: true }));

socketServer.on("connection", (socket) => {
  console.log("User connection");

  socket.use((packet, next) => {
    if (packet[0] === "message") {
      if (checkUserSocket(socket.handshake.session)) {
        return next();
      } else {
        socket.emit("error", "Not allowed to send messages");
      }
    } else if (packet[0] === "addProduct") {
      if (checkAdminSocket(socket.handshake.session)) {
        return next();
      }
      socket.emit("error", "Not allowed to add products");
    } else {
      return next();
    }
  });

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
      socket.emit("error", "Not allowed to add products");
    }
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


export {app,mongoose};