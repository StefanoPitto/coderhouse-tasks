import { Router } from "express";
import { check } from "express-validator";
import { fieldsValidation } from "../middlewares/fieldsValidation.js";
import { userManager } from "../dao/UsersManager.js";
import passport from "passport";
export const usersRouter = Router();

usersRouter.post(
  "/",
  [
    check("name").notEmpty().isString(),
    check("email").notEmpty().isEmail(),
    check("password").notEmpty().isString(),
    check("age").notEmpty().isNumeric(),
    check("address").notEmpty().isString(),
    check("role").isIn(["admin", "user"]),
    fieldsValidation,
  ],
  async (req, res) => {
    // get the user details from the request body
    const { name, email, password, age, address, role = "user" } = req.body;

    const user = { name, email, password, age, address, role };

    try {
      const userFromDb = await userManager.createUser(user);
      res
        .status(201)
        .json({ message: "User account created successfully", ...userFromDb });
    } catch (err) {
      return res.status(500).json({ err });
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
      const user = await userManager.login({ email, password });
      console.log("USERID", user.id);
      req.session.user = { id: user._id, email: user.email };
      res.status(201).json({ msg: "Login succesfull", ...user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ err });
    }
  }
);

usersRouter.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userManager.getUserById(userId);
    res.status(200).json({ ...user });
  } catch (error) {
    res.status(500).json({ msg: "Error!" });
  }
});

usersRouter.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error logging out");
    } else {
      res.sendStatus(200);
    }
  });
});

usersRouter.get(
  "/githubLogin",
  passport.authenticate("github", { scope: ["user:email"] })
);
usersRouter.get(
  "/github",
  passport.authenticate("github", {
    failureRedirect: "/",
  }),
  async (req, res) => {
    req.session.email = req.user.email;
    res.redirect("/user-profile");
  }
);
