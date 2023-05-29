import { Router } from "express";
import { userManager } from "../dao/UsersManager.js";
import { UserModel } from "../dao/models/user.model.js";
import passport from "passport";
import "../passport/passport.js";
export const usersRouter = Router();

usersRouter.get(
  "/registerGitHub",
  passport.authenticate("github", { scope: ["user:email"] }),
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
  },
);

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
      res.status(200).redirect(`/user-profile?id=${userFromDb._id}`);
    },
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
    },
  )(req, res, next);
});

usersRouter.post('/reset-password', async (req, res) => {
  const { token } = req.body;
  try {
    await userManager.handlePasswordResetRequest(token);
    res.redirect(`/change-password?token=${token}`);
  } catch (error) {
    res.status(400).json({ msg: 'Error', error: error });
  }
});

usersRouter.post("/forgot-password", async (req,res)=>{
  const {email} = req.body;
  try{
    await userManager.recoverPassword(email);
    res.status(200).json({msg:"Email, was sent"})
  }catch(error){
    res.status(400).json({msg:'User does not exists.'})
  }


})

usersRouter.post('/change-password', async (req, res) => {
  const { password, token } = req.body;

  try {
      const userFromDb = await userManager.updateUserPasswordFromToken(password,token);
      res.redirect(`/user-profile?id=${userFromDb._id}`);
    
  } catch (error) {
    res.status(400).json({ msg: 'Invalid or expired token.' });
  };
})

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

usersRouter.get("/premium/:uid", async (req,res)=>{
  const userId = req.params.uid;

try{
  await userManager.updatePremiumUser(userId)
  res.status(200).json({ok:true,msg:'Role updated'});
}catch(error){
  console.log(error);
  res.status(400).json({ok:false,msg:'Wrong user'});
}
})

usersRouter.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userManager.getUserById(userId);
    res.status(200).json({ ...user });
  } catch (error) {
    res.status(500).json({ msg: "Error!" });
  }
});
