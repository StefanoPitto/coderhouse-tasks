let container = document.getElementById("products-container");
let chatContainer = document.getElementById("chat-container");
let emailInput = document.getElementById("emailInput");
let textInput = document.getElementById("textInput");
let chatForm = document.getElementById("chat-form");

const socket = io();

socket.on("connect", () => {
  //Products
  socket.emit("loadProductsOnConnection");
  socket.on("products", (products) => {
    const html = products
      .map(
        (elem) =>
          `<div><h1>Title: ${elem.title}</h1><p>Description: ${elem.description}</p><span>Price: $${elem.price}</span></div>`
      )
      .join("");

    container.innerHTML = html;
  });

  socket.on("productUpdate", (products) => {
    const html = products
      .map(
        (elem) =>
          `<div><h1>${elem.title}</h1><p>${elem.description}</p><span>${elem.price}</span></div>`
      )
      .join("");

    realTimeContainer.innerHTML += html;
  });
  //Chat
  socket.emit("loadChatOnConnection");
  socket.on("messageUpdate", (messageArray) => {
    let content = messageArray
      .map(
        (elem) =>
          `<div><p>User: ${elem.user}</p> <p>Message: ${elem.message}</p></div>`
      )
      .join("");
    chatContainer.innerHTML = content;
  });
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  socket.emit("message", { user: emailInput.value, message: textInput.value });
});

socket.on("loadMessages", (messageArray) => {
  let content = messageArray
    .map(
      (elem) =>
        `<div><p>User: ${elem.user}</p> <p>Message: ${elem.message}</p></div>`
    )
    .join("");
  chatContainer.innerHTML = content;
});
