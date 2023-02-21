let container = document.getElementById("container");
let chatContainer = document.getElementById("chat-container");
let emailInput = document.getElementById("emailInput");
let textInput = document.getElementById("textInput");
let chatForm = document.getElementById("chat-form");
const socket = io();

socket.on("connect", () => {
  socket.on("Products", (products) => {
    const html = products
      .map(
        (elem) =>
          `<div><h1>${elem.title}</h1><p>${elem.description}</p><span>${elem.price}</span></div>`
      )
      .join("");

    container.innerHTML = html;
  });

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
  console.log("asdasghdjjhasdf");
  socket.emit("message", { user: emailInput.value, message: textInput.value });
});
