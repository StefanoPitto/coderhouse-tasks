import jwt from "jsonwebtoken";
import { ProductModel } from "../dao/models/product.model.js"

export const checkAdminSocket = (socket) => {
  const { token } = socket;

  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwt.decode(token, process.env.SECRET_KEY);
    console.log(decodedToken.role === "admin");
    return decodedToken.role === "admin";
  } catch (err) {
    return false;
  }
};

export const checkAdminRoutes = (req, res, next) => {
  let token = req.session.token
  if (!token) {
    return res.status(403).json({ msg: "Not allowed." });
  }

  try {
    const decodedToken = jwt.decode(token, process.env.SECRET_KEY);
    console.log(decodedToken.role === "user");
    if (decodedToken.role === "admin") next();
    else return res.status(403).json({ msg: "Not an ADMIN" });
  } catch (err) {
    console.log(err);
  }
};

export const verifyTokenAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = jwt.decode(token, process.env.SECRET_KEY);

      if (decodedToken.role === "admin") next();


   
      next(); 
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' }); 
    }
  } else {
    res.status(401).json({ error: 'No token provided' }); 
  }
};




export const checkDeleteProduct = async (req, res, next) => {
  let token = req.session.token
 
  if (!token) {
    return res.status(403).json({ msg: "Not allowed." });
  }

  try {
    const decodedToken = jwt.decode(token, process.env.SECRET_KEY);
    console.log(decodedToken.role === "user");
    if (decodedToken.role === "admin") next()
    else {
      if(decodedToken.role ==="user") return res.status(403).json({ msg: "Not an ADMIN" });
      
     const productDB  = await ProductModel.findOne({id:req.params.pid});

      if(productDB.owner.email === req.session.email) next();
      else return res.status(403).json({ msg: "The user is not the product owner" });

    }
  } catch (err) {
    console.log(err);
  }
};