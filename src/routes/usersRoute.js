import { Router, response } from "express";
import { userManager } from "../dao/UsersManager.js";
import { UserModel } from "../dao/models/user.model.js";
import passport from "../passport/passport.js";
import "../passport/passport.js";
import { uploadFile } from "../utils.js";
export const usersRouter = Router();

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
        return res.redirect("/");
      }
      req.session.email = user.email;
      const userFromDb = await UserModel.findOne({ email: user.email });
      res.redirect(`/user-profile?id=${userFromDb._id}`);
    }
  )(req, res, next);
});

usersRouter.post("/login", async (req, res, next) => {
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
        return res.redirect("/");
      }
      res.redirect(`/user-profile?id=${user.toString()}`);
    }
  )(req, res, next);
});

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
  "/registerGitHub",
  passport.authenticate("github", { scope: ["user:email"] })
);
usersRouter.get(
  "/github",
  passport.authenticate("github", {
    failureRedirect: "/",
  }),
  async (req, res) => {
    req.session.email = req.user.email;
    const userFromDb = await UserModel.findOne({ email: req.user.email });

    res.redirect(`/user-profile?id=${userFromDb._id}`);
  }
);

usersRouter.post(
  "/:uid/documents",
  uploadFile.array("documents"),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const { documents } = req.body;

      // Actualiza el estado del usuario con los documentos cargados
      // Aquí deberías implementar la lógica para actualizar la propiedad de estado del usuario según los documentos cargados

      res.status(200).json({ message: "Archivos subidos exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al cargar los archivos" });
    }
  }
);

usersRouter.put("/premium/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    // Verifica si el usuario ha cargado los documentos requeridos
    const user = await User.findById(uid);
    const requiredDocuments = [
      "Identificación",
      "Comprobante de domicilio",
      "Comprobante de estado de cuenta",
    ];
    const userDocuments = user.documents.map((doc) => doc.name);

    const hasRequiredDocuments = requiredDocuments.every((doc) =>
      userDocuments.includes(doc)
    );

    if (!hasRequiredDocuments) {
      return res
        .status(400)
        .json({ error: "El usuario no ha cargado los documentos requeridos" });
    }

    // Si el usuario ha cargado los documentos requeridos, actualízalo a premium
    user.role = "premium";
    await user.save();

    res
      .status(200)
      .json({ message: "Usuario actualizado a premium exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario a premium" });
  }
});
