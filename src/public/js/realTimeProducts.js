let realTimeContainer = document.getElementById("real-time-container");
let productForm = document.getElementById("add-product-form");
let titleInput = document.getElementById("titleInput");
let descriptionInput = document.getElementById("descriptionInput");
let priceInput = document.getElementById("priceInput");
let stockInput = document.getElementById("stockInput");
let categoryInput = document.getElementById("categoryInput");
let codeInput = document.getElementById("codeInput");
let thumbnailInput = document.getElementById("thumbnailInput");
let addBtn = document.getElementById("add-btn");
let removeBtn = document.getElementById("remove-btn");
let thumbnailContainer = document.getElementById("thumbnail-container");
let errorMessage = document.getElementById("errorMessage");
let thumbnails = [];

const socket = io();

socket.on("connect", () => {
  socket.emit("loadProductsOnConnection");
  socket.on("products", (products) => {
    const html = products
      .map(
        (elem) =>
          `<div><h1>Title: ${elem.title}</h1><p>Description: ${elem.description}</p><span>Price: $${elem.price}</span></div>`
      )
      .join("");
    realTimeContainer.innerHTML = html;
  });
  socket.on("productsUpdated", (products) => {
    const html = products
      .map(
        (elem) =>
          `<div><h1>Title: ${elem.title}</h1><p>Description: ${elem.description}</p><span>Price: $${elem.price}</span></div>`
      )
      .join("");
    realTimeContainer.innerHTML = html;
  });
});

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let newProduct = {
    title: titleInput.value,
    description: descriptionInput.value,
    price: parseInt(priceInput.value),
    stock: parseInt(stockInput.value),
    category: categoryInput.value,
    code: codeInput.value,
    thumbnail: thumbnails,
  };
  socket.emit("addProduct", newProduct);
  socket.on("error", (error) => {
    errorMessage.innerHTML = error;
    setTimeout(() => (errorMessage = ""), 3000);
  });
});

addBtn.addEventListener("click", (e) => {
  alert();
  let value = thumbnailInput.value;
  if (value.length === 0) return;
  thumbnails.push(value);
  const html = thumbnails.map((elem) => `<div>${elem}</div>`).join("");
  thumbnailContainer.innerHTML = html;
});

removeBtn.addEventListener("click", (e) => {
  thumbnails = [];
  thumbnailContainer.innerHTML = "";
});

resetInputs = () => {
  titleInput.value = "";
  descriptionInput.value = "";
  priceInput.value = "";
  stockInput.value = "";
  categoryInput.value = "";
  codeInput.value = "";
  thumbnails = "";
  thumbnailContainer.innerHTML = "";
};
