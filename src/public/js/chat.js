let container = document.getElementById("container");
let emailInput = document.getElementById("emailInput");
let textInput = document.getElementById("textInput");
let sendBtn = document.getElementById("sendBtn");

const socket = io();

socket.on("connect", () => {
  socket.emit("message", {
    user: emailInput.value,
    message: textInput.value,
  });
});
sendBtn.addEventListener("click", () => {
  socket.emit("message", {
    user: emailInput.value,
    message: textInput.value,
  });
});

socket.on("messageUpdate", (messageArray) => {
  let content = messageArray.map(
    (elem) =>
      `<div><p>User: ${elem.user}</p> <p>Message: ${elem.message}</p></div>`
  );
  container.innerHTML = content;
});
