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
        (product) =>
          `<div class="product">
          <h2 class="product-title">${product.title}</h2>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <p class="product-stock">${product.stock}</p>
          <p class="product-category">${product.category}</p>
        </div>`
      )
      .join("");

    container.innerHTML = html;
  });

  socket.on("productUpdate", (products) => {
    const html = products
      .map(
        (product) =>
          `<div class="product">
          <h2 class="product-title">${product.title}</h2>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <p class="product-stock">${product.stock}</p>
          <p class="product-category">${product.category}</p>
        </div>`
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
          `<div><p class="user">User: ${elem.user}</p> <p class="message">Message: ${elem.message}</p></div>`
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
        `<div><p class="user">User: ${elem.user}</p> <p class="message">Message: ${elem.message}</p></div>`
    )
    .join("");
  chatContainer.innerHTML = content;
});
