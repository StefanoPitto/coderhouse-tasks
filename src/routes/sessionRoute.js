import { Router } from "express";
import { generateToken } from "../utils.js";
import { userManager } from "../dao/UsersManager.js";
import { validateJWT } from "../middlewares/middleware.js";
import jwt from "jsonwebtoken";
export const sessionRouter = Router();



/**
 * @swagger
 * /session/login:
 *   post:
 *     summary: User login
 *     description: Logs in a user with the provided credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       400:
 *         description: User does not exist.
 */
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
/**
 * @swagger
 * /session:
 *   get:
 *     summary: Validate token
 *     description: Validates the JWT token in the request.
 *     responses:
 *       200:
 *         description: Token validated successfully.
 */
sessionRouter.get("/", validateJWT, (req, res) => {
  res.status(200).send("Token validated");
});
/**
 * @swagger
 * /session/current:
 *   get:
 *     summary: Get current user
 *     description: Retrieves the details of the current user.
 *     responses:
 *       200:
 *         description: Current user details.
 *       401:
 *         description: No token provided or invalid token.
 */
sessionRouter.get("/current", async (req, res) => {
  const token = req.cookies.token;
  const cookie = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    return res.status(200).json({ userFromCookie: user });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});
