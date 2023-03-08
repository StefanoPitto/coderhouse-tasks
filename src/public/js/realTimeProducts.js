const socket = io();

socket.on("Products", (products) => {
  const html = products
    .map(
      (elem) =>
        `<div><h1>${elem.title}</h1><p>${elem.description}</p><span>${elem.price}</span></div>`
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

  container.innerHTML = html;
});
