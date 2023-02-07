import { httpServer } from "../app";
import { manager } from "../ProductManager";
//Socket

const socketServer = new Server(httpServer);

socketServer.on("connection", () => {
  console.log("User connected");
  socket.on("Products", () => {
    socket.emit("Products", manager.getProducts());
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

socketServer.on("product", (products) => {
  socketServer.emit("newProduct", products);
});
