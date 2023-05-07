const catalogue = document.getElementById("container");

(async () => {
  const response = await fetch(
    "http://localhost:8080/api/products/mockingproducts",
  );
  const products = await response.json();
  console.log(products, "prodddd");
  const productsHtml = products.products
    .map(
      (product) =>
        `
      <div class="product">
        <h2>${product.title}</h2>
          <img class="thumbnails" src="${product.thumbnails[0]}" alt="${product.title}" />
        <p>${product.description}</p>
        <p>Code: ${product.code}</p>
        <p>Price: ${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <p>Status: ${product.status}</p>
        <p>Category: ${product.category}</p>
      </div>
    `,
    )
    .join("");
  catalogue.innerHTML = productsHtml;
})();
