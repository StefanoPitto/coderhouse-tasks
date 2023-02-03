const { manager } = require("../../ProductManager");
//Socket

const socket = io();

socket.on();

let container = document.getElementById("container");

const products = manager.getProducts();

products.forEach((elem) => {
  container.innerHTML += `<div><h1>${elem.title}</h1><p>${elem.description}</p><span>${elem.price}</span></div>`;
});
