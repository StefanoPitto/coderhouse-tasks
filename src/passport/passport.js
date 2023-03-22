import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { UserModel } from "../dao/models/user.model.js";
import { hash } from "bcrypt";

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await UserModel.findOne({ email });
      if (user) {
        return done(null, false);
      }
      const hashedPassword = await hash(password, 10);
      const newUser = { ...req.body, password: hashedPassword };
      const newuserDB = await UserModel.create(newUser);
      done(null, newuserDB);
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, res, email, password, done) => {
      const user = await UserModel.findOne({ email });
      if (user) {
        return done(null, false);
      }
      const hashedPassword = await hash(password, 10);
      const newUser = new UserModel({ ...user, password: hashedPassword });

      await newUser.save();
      res.redirect(`/user-profile?id=${userId}`);
      done(null, newUser);
    }
  )
);

passport.use(
  "GitHub",
  new GitHubStrategy(
    {
      clientID: "Iv1.20237976621ec5c1",
      clientSecret: "1f8be03f1b4d6b75068e3b0251fc297df6e4ef87",
      callbackURL: "http://localhost:8080/api/auth/GitHub",
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await UserModel.findOne({ email: profile._json.email });
      if (!user) {
        const newUser = {
          name: profile._json.name,
          email: profile._json.email,
          password: " ",
          address: " ",
          age: 0,
          role: "user",
        };
        const dbResult = await UserModel.save(newUser);
        done(null, dbResult);
      } else {
        done(null, user);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});
