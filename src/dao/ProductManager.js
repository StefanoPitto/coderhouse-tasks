import mongoose from "mongoose";
import { ProductModel } from "./models/product.model.js";

export class ProductManager {
  constructor() {
    this.collection = ProductModel;
    this.counter = 0;
  }
  addProduct = async (product) => {
    const item = await this.collection.findOne({ code: product.code });
    if (item) {
      throw new Error("Error! Product already exists");
    }

    const newProduct = new ProductModel({ id: this.counter, ...product });

    try {
      await newProduct.save();
      console.log(newProduct);
    } catch (err) {
      throw new Error("Error, when adding a new product!");
    }

    this.counter++;
  };

  getProducts = async () => {
    let exists = await this.collection.exists();
    if (!exists) throw new Error("Collection is empty");
    if (this.collection.countDocuments === 0)
      throw new Error("Collection is Empty");
    let products = await this.collection.find();
    return products;
  };

  getProductById = async (id) => {
    const product = await this.collection.findOne({ id });
    if (!product) {
      throw new Error("Product does not exist");
    }
    return product;
  };

  deleteProduct = async (id) => {
    let newId = parseInt(id);
    const product = await this.collection.findOne({ id: newId });
    if (!product) throw new Error("Product does not exist.");
    try {
      await this.collection.deleteOne({ id: newId });
    } catch (error) {
      throw new Error("Error when trying to remove the product");
    }
  };

  updateProduct = async (id, info) => {
    let newId = parseInt(id);
    const product = await this.collection.findOne({ id: newId });
    if (!product) throw new Error("Product does not exist.");
    try {
      await this.collection.findOneAndUpdate(
        { id: newId },
        { ...product._doc, ...info }
      );
    } catch (error) {
      throw new Error("Error when trying to update the product!");
    }
  };
}

export const manager = new ProductManager();
