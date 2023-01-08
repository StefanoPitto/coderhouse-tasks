class ProductManager {
  constructor() {
    this.counter = 0;
    this.products = [];
  }
  addProduct = (title, description, price, thumbnail, code, stock) => {
    let item = this.products.find((elem) => elem.code === code);
    if (item) {
      return;
    }
    this.products.push({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id: this.counter,
    });
    this.counter++;
  };

  getProducts = () => {
    return this.products;
  };

  getProductById = (id) => {
    let toReturn = this.products.find((elem) => elem.id === id);
    if (!toReturn) {
      console.log("Not found");
      return;
    }
    return toReturn;
  };
}

const manager = new ProductManager();

/*
 let productos = manager.getProducts();
 console.log("Productos1", productos);
 manager.addProduct("Pure", "Pure", 124, "thumbnail", "codigo", 10);
 console.log("Productos2", productos);
 console.log("ID1", manager.getProductById(productos[0].id));
 console.log("ID2", manager.getProductById(1));
 manager.addProduct("Pure", "Pure", 124, "thumbnail", "codigu", 10);
 console.log("Productos3", productos);
 manager.addProduct("Pure", "Pure", 124, "thumbnail", "codigo", 10);
 console.log("Productos4", productos);
*/

// Otra alternativa seria que el producto tenga su propia clase y crear el objecto en addProduct y luego agregarlo al array.

class Product {
  constructor(title, description, price, thumbnail, code, stock, id) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = id;
  }

  getTitle = () => {
    return this.title;
  };

  getDescription = () => {
    return this.description;
  };

  getPrice = () => {
    return this.price;
  };

  getThumbnail = () => {
    return this.thumbnail;
  };

  getCode = () => {
    return this.code;
  };

  getStock = () => {
    return this.stock;
  };

  getId = () => {
    return this.id;
  };

  setTitle = (title) => {
    this.title = title;
  };

  setDescription = (description) => {
    this.description = description;
  };

  setPrice = (price) => {
    this.price = price;
  };

  setCode = (code) => {
    this.code = code;
  };

  setStock = (stock) => {
    this.stock = stock;
  };

  setId = (id) => {
    this.id = id;
  };
}

// node ProductManager.js para correrlo en consola.
