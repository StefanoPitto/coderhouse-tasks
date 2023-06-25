import { uuid } from 'uuidv4';
import { CartModel } from "./models/cart.model.js";
import { ProductModel } from "./models/product.model.js";
import { TicketModel } from "./models/ticket.model.js";

class CartManager {
  constructor() {
    this.collection = CartModel;
  }


  createCart = async () => {
    const newCart = new CartModel();
    try {
      await newCart.save();
      console.log(newCart._id)
      return newCart._id;

    } catch (error) {
      throw new Error("Error when trying to create a new cart!");
    }
  };

  addProductToCart = async (cartId, productId, quantity) => {
    const cart = await this.collection.findById(cartId);
    if (!cart) throw new Error("Cart does not exist!");
    console.log(cart)
    try {
      let products = cart.cart || []; 
      let productIndex = products.findIndex((elem) => elem.id === productId);
      if (productIndex !== -1) {
        products[productIndex].quantity += quantity;
      } else {
        products.push({ id: productId, quantity });
      }
      cart.cart =products;
      await cart.save();
    } catch (error) {
      throw new Error("Error when trying to add the product to the cart.");
    }
  };
  

  purchaseCart = async (cartId,email) => {
    try {
    
      const cart = await this.collection.findOne({ id: cartId });
  
      if (!cart) {
        throw new Error("Cart not found");
      }
  
      let totalPrice = 0;
      let productsToUpdateStock = [];
  
      for (let i = 0; i < cart.cart.length; i++) {
        const cartProduct = cart.cart[i];
        const product = await ProductModel.findOne({ id: cartProduct.id });
  
        if (!product) {
          throw new Error(`Product with id ${cartProduct.id} not found`)
        }
  
        console.log(product);
        console.log(cartProduct);

        if (product.stock >= cartProduct.quantity) {
          totalPrice += product.price * cartProduct.quantity;
          productsToUpdateStock.push({
            id: product.id,
            quantity: cartProduct.quantity,
          });
        } else {
         throw new Error(
            `Product with id ${product.id} does not have enough stock`,
         )
        }
      }
  
      for (let i = 0; i < productsToUpdateStock.length; i++) {
        const productToUpdate = productsToUpdateStock[i];
        await ProductModel.updateOne(
          { id: productToUpdate.id },
          { $inc: { stock: -productToUpdate.quantity } },
        );
      }
  
  
  
      const ticket = new TicketModel({
        code: uuid(),
        purchase_datetime: new Date(),
        amount: totalPrice,
        purchaser: cartId,
      });
  
      
      await CartModel.deleteOne({ id: cartId });
      await ticket.save();
      
      return ticket;
    } catch (error) {
      console.error(error);
      throw new Error("Server error")
    }
  }



  getCartById = async (cartId) => {
    const cart = await this.collection.findById(cartId);
    if (!cart) {
      throw new Error("Cart does not exist");
    }
    return cart;
  };
}

export const cartManager = new CartManager();
