import mongoose from "mongoose";
import { ProductModel } from "./models/product.model.js";

export class ProductManager {
  constructor() {
    this.collection = ProductModel;
  }
  addProduct = async (product) => {
    const item = await this.collection.findOne({ code: product.code });
    if (item) {
      return;
    }

    const newProduct = new ProductModel({ ...product });

    try {
      await newProduct.save();
      return newProduct;
    } catch (err) {
      throw new Error("Error when adding a new product!");
    }

  };

  getProducts = async (
    limit = 10,
    page = 1,
    sort = "asc",
    category,
    minPrice = 0,
    maxPrice = 100000,
  ) => {
    const filter = {
      category: category || { $exists: true },
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    };

    const orderBy = {
      price: sort === "desc" ? -1 : 1,
    };

    let exists = await this.collection.exists();
    if (!exists) throw new Error("Collection is empty");
    let result = await this.collection.paginate(filter, {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: orderBy,
    });
    let products = result.docs; // extract the docs property from the result
    return products;
  };

  getProductById = async (id) => {
    const product = await this.collection.findOne({ id });
    if (!product) {
      throw new Error("Product does not exist");
    }
    return product;
  };

  deleteProduct = async (id,role) => {
    let newId = parseInt(id);
    const product = await this.collection.findOne({ id: newId });
    if (!product) throw new Error("Product does not exist.");
    try {
      await this.collection.deleteOne({ id: newId });
    } catch (error) {
      throw new Error("Error when trying to remove the product");
    }
  };

  updateProduct = async (id, info,owner,role) => {
    let newId = parseInt(id);
    const product = await this.collection.findOne({ id: newId });
    if (!product) throw new Error("Product does not exist.");
    if(owner !== product.owner && role !== 'admin' ) throw new Error('Not Allowed to edit the product');
    try {
      await this.collection.findOneAndUpdate(
        { id: newId },
        { ...product._doc, ...info },
      );
    } catch (error) {
      throw new Error("Error when trying to update the product!");
    }
  };

  setCounter = async () => {
    const size = await this.collection.countDocuments();
    this.counter = size;
  };
}

export const manager = new ProductManager();
