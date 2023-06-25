import { Router } from "express";
import { userManager } from "../../dao/UsersManager.js";
import { UserModel } from "../../dao/models/user.model.js";
import passport from "passport";
import "../../passport/passport.js";
import { uploadFile } from "../../utils.js";

export const usersRouter = Router();

/**
 * @swagger
 * /auth/registerGitHub:
 *   get:
 *     summary: Register with GitHub
 *     description: Redirects the user to the GitHub authentication page for registration.
 *     responses:
 *       200:
 *         description: Redirect to GitHub authentication page.
 */
usersRouter.get(
  "/registerGitHub",
  passport.authenticate("github", { scope: ["user:email"] })
);

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: GitHub authentication callback
 *     description: Handles the callback after successful GitHub authentication.
 *     responses:
 *       302:
 *         description: Redirect to user profile page.
 */
usersRouter.get(
  "/github",
  passport.authenticate("github", {
    failureRedirect: "/",
  }),
  async (req, res) => {
    req.session.email = req.user.email;
    const userFromDb = await UserModel.findOne({ email: req.user.email });

    res.status(200).redirect(`/user-profile?id=${userFromDb._id}`);
  }
);

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: User registration
 *     description: Registers a new user.
 *     responses:
 *       302:
 *         description: Redirect to user profile page.
 */
usersRouter.post("/", async (req, res, next) => {
  passport.authenticate(
    "register",
    {
      failureRedirect: "/",
    },
    async (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).redirect("/");
      }
      req.session.email = user.email;
      const userFromDb = await UserModel.findOne({ email: user.email });
      res.status(200).json({id:userFromDb._id}).redirect(`/user-profile?id=${userFromDb._id}`);
    }
  )(req, res, next);
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Logs in a user with the provided credentials.
 *     responses:
 *       302:
 *         description: Redirect to user profile page.
 */
usersRouter.post("/login", (req, res, next) => {
  passport.authenticate(
    "login",
    {
      failureRedirect: "/",
    },
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).send("Bad Request");
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
      
        const responseData = {
          id: user.id.toString(),
          token: user.token,
          redirectUrl: `/user-profile?id=${user.id.toString()}`,
        };
        res.status(200).json(responseData);
        
      });
    }
  )(req, res, next);
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password request
 *     description: Handles a request to reset the user's password.
 *     responses:
 *       302:
 *         description: Redirect to change password page.
 */
usersRouter.post('/reset-password', async (req, res) => {
  const { token } = req.body;
  try {
    await userManager.handlePasswordResetRequest(token);
    res.redirect(`/change-password?token=${token}`);
  } catch (error) {
    res.status(400).json({ msg: 'Error', error: error });
  }
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Handles a request to recover a forgotten password.
 *     responses:
 *       200:
 *         description: Password recovery email sent successfully.
 *       400:
 *         description: User does not exist.
 */
usersRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    await userManager.recoverPassword(email);
    res.status(200).json({ msg: "Email was sent" });
  } catch (error) {
    res.status(400).json({ msg: "User does not exist." });
  }
});

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change password
 *     description: Handles a request to change the user's password.
 *     responses:
 *       302:
 *         description: Redirect to user profile page.
 *       400:
 *         description: Invalid or expired token.
 */
usersRouter.post('/change-password', async (req, res) => {
  const { password, token } = req.body;

  try {
    const userFromDb = await userManager.updateUserPasswordFromToken(password, token);
    res.redirect(`/user-profile?id=${userFromDb._id}`);
  } catch (error) {
    res.status(400).json({ msg: 'Invalid or expired token.' });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the user and destroys the session.
 *     responses:
 *       200:
 *         description: User logged out successfully.
 */
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

/**
 * @swagger
 * /auth/premium/{uid}:
 *   get:
 *     summary: Update user role to premium
 *     description: Updates the user role to premium.
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Role updated successfully.
 *       400:
 *         description: Wrong user or error updating role.
 */
usersRouter.get("/premium/:uid", async (req, res) => {
  const userId = req.params.uid;

  try {
    await userManager.updatePremiumUser(userId);
    res.status(200).json({ ok: true, msg: "Role updated" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ ok: false, msg: "Wrong user or error updating role" });
  }
});

/**
 * @swagger
 * /auth/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves the details of a user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details.
 *       500:
 *         description: Error retrieving user details.
 */
usersRouter.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userManager.getUserById(userId);
    res.status(200).json({ ...user });
  } catch (error) {
    res.status(500).json({ msg: "Error retrieving user details" });
  }
});

usersRouter.post(
  "/:uid/documents",
uploadFile.array("documents"),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const { documents } = req.body;

      // Verifica si el usuario existe
      const user = await User.findById(uid);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Actualiza el estado del usuario con los documentos cargados
      documents.forEach((document) => {
        const existingDocument = user.documents.find(
          (doc) => doc.name === document.name
        );
        if (existingDocument) {
          existingDocument.status = "approved";
        }
      });

      // Guarda los cambios en la base de datos
      await user.save();

      res.status(200).json({ message: "Archivos subidos exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al cargar los archivos" });
    }
  }
);
