import { Router } from "express";
import { generateToken, secretKey } from "../utils.js";
import { userManager } from "../dao/UsersManager.js";
import { validateJWT } from "../middlewares/middleware.js";
import jwt from "jsonwebtoken";
export const sessionRouter = Router();

sessionRouter.post("/login", async (req, res) => {
  const user = await userManager.login({
    email: req.body.email,
    password: req.body.password,
  });
  if (user) {
    const token = generateToken(user);
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expiresIn: 86400, // expires in 24 hours
      })
      .send();
  }

  res.status(400).json({ message: "User does not exist" });
});

sessionRouter.get("/", validateJWT, (req, res) => {
  res.status(200).send("Token validated");
});

sessionRouter.get("/current", async (req, res) => {
  const token = req.cookies.token;
  const cookie = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const user = jwt.verify(token, secretKey);
    return res.status(200).json({ userFromCookie: user });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});
