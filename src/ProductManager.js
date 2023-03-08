const fs = require("fs");
const path = "./products.txt";

class ProductManager {
  constructor(path) {
    path.length === 0 ? (this.path = "./products.txt") : (this.path = path);
    this.counter = 0;
    if (fs.existsSync(this.path)) {
      fs.readFileSync(this.path).length > 0
        ? (this.products = JSON.parse(fs.readFileSync(this.path)))
        : (this.products = []);
    } else {
      this.products = [];
    }

    this.updateFile();
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
    this.counter += 1;
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
    let array = JSON.parse(fs.readFileSync(this.path));
    let toReturn = array.find((elem) => elem.id === id);
    if (!toReturn) {
      console.log("Not found");
      return;
    }
    return toReturn;
  };

  deleteProduct = (id) => {
    this.products = this.products.filter((elem) => elem.id !== id);
    this.updateFile();
  };

  updateProduct = (id, product) => {
    let index = this.products.findIndex((elem) => elem.id === id);
    if (index === -1) return;
    this.products[index] = { ...this.products[index], ...product, id };
    this.updateFile();
  };
}

const manager = new ProductManager(path);

manager.addProduct("uno", "uno", "uno", "uno", "uno", "uno");

manager.addProduct("dos", "dos", "dos", "dos", "dos", "dos");

module.exports = { manager };
