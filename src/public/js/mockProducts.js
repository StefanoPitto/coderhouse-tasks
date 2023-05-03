const catalogue = document.getElementById("catalogue");

const getProducts = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/products/mockingproducts",
      {
        method: "GET",
      },
    );
    const products = await response.json();
    console.log("PRODUCTOS", products); // Do something with the products
    return products;
  } catch (err) {
    console.error(err);
  }
};

(() => {
  const products = getProducts();
  let productsHtml = "";
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const thumbnailsHtml = product.thumbnails
      .map(
        (thumbnail) => `
        <img src="${thumbnail}" alt="${product.title}" />
      `,
      )
      .join("");
    const productHtml = `
        <div class="product">
          <h2>${product.title}</h2>
          <div class="thumbnails">
            ${thumbnailsHtml}
          </div>
          <p>${product.description}</p>
          <p>Code: ${product.code}</p>
          <p>Price: ${product.price}</p>
          <p>Stock: ${product.stock}</p>
          <p>Status: ${product.status}</p>
          <p>Category: ${product.category}</p>
        </div>
      `;
    productsHtml += productHtml;
  }
})();
