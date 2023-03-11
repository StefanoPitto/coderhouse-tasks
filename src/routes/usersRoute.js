import { Router } from "express";
import { manager } from "../dao/ProductManager.js";
import { check } from "express-validator";
import { fieldsValidation } from "../middlewares/fieldsValidation.js";

export const usersRouter = Router();

usersRouter.post(
  "/",
  [
    check("name").notEmpty().isString(),
    check("email").notEmpty().isEmail(),
    check("password").notEmpty().isString().isStrongPassword(),
    check("age").notEmpty().isNumeric(),
    check("address").notEmpty().isString(),
    check("role").isIn(["admin", "user"]),
    fieldsValidation,
  ],
  async (req, res) => {
    // get the user details from the request body
    const { name, email, password, age, address } = req.body;

    try {
      // create a new user document
      const user = new UserModel({
        name,
        email,
        password,
        age,
        address,
      });

      // save the user document to the database
      await user.save();

      // return a success response
      res.status(201).json({ message: "User account created successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

usersRouter.post(
  "/login",
  [
    check("email").notEmpty().isEmail(),
    check("password").notEmpty(),
    fieldsValidation,
  ],
  async (req, res) => {
    const { email, password } = req.body;

    try {
      // find the user with the given email
      const user = await User.findOne({ email });

      // if the user is not found, return an error response
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // initialize the user's session
      req.session.userId = user._id;

      // return a success response with the token
      res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);
