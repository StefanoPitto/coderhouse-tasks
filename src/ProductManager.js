import fs from "fs";
const path = "./src/assets/products.json";

export class ProductManager {
  constructor(path) {
    path.length === 0
      ? (this.path = "./src/assets/products.json")
      : (this.path = path);
    this.counter = 0;
    if (fs.existsSync(this.path)) {
      fs.readFileSync(this.path).length > 0
        ? (this.products = JSON.parse(fs.readFileSync(this.path)))
        : (this.products = []);
    } else {
      this.products = [];
    }
    if (this.products.length > 0) this.counter = this.products.length;
  }
  addProduct = (product) => {
    let item = this.products.find((elem) => elem.code === product.code);
    if (item) {
      throw new Error("Error! Product already exists");
    }
    this.products.push({
      ...product,
      id: this.counter,
    });
    this.counter = this.counter + 1;
    this.updateFile();
  };

  updateFile = () => {
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  };
  getProducts = () => {
    if (!fs.existsSync(this.path)) return;
    return JSON.parse(fs.readFileSync(this.path));
  };

  getProductById = (id) => {
    let toReturn = this.product.find((elem) => elem.id === id);
    if (!toReturn) {
      console.log("Not found");
      return;
    }
    return toReturn;
  };

  deleteProduct = (id) => {
    let index = this.products.findIndex((elem) => elem.id === parseFloat(id));
    if (index === -1) throw new Error("Product does not exist.");
    this.products = this.products.filter((elem) => elem.id !== parseFloat(id));
    this.updateFile();
  };

  updateProduct = (id, product) => {
    let index = this.products.findIndex((elem) => elem.id === parseFloat(id));
    if (index === -1) throw new Error("Product does not exist.");
    this.products[index] = { ...this.products[index], ...product, id };
    this.updateFile();
  };
}

export const manager = new ProductManager(path);
