import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { UserModel } from "../dao/models/user.model.js";
import { hash, compare } from "bcrypt";

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
      const { name, age, address, role } = req.body;
      if (user) {
        return done(null, false);
      }
      const hashedPassword = await hash(password, 10);
      const newUser = {
        first_name: name.split(" ")[0],
        last_name: name.split(" ")[1] || "",
        age: age || 0,
        email,
        password: hashedPassword,
        address: address || "",
        role,
      };
      const newUserDB = await UserModel.create(newUser);
      done(null, newUserDB);
    },
  ),
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });

        if (!user)
          return done(null, false, { message: "Invalid email or password" });

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid)
          return done(null, false, { message: "Invalid email or password" });

        req.session.email = user.email;
        req.session.password = user.password;
        done(null, user._id);
      } catch (error) {
        console.log(error);
        done(error);
      }
    },
  ),
);

passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: "Iv1.b31ec3fe2305a7b3",
      clientSecret: "f747556b6aa038769714d1f6cdf431aba9f4b1c4",
      callbackURL: "http://localhost:8080/api/auth/github",
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await UserModel.findOne({ email: profile._json.email });
      console.log(profile._json);
      if (!user) {
        const newUser = {
          first_name: profile._json.name.split(" ")[0] || " ",
          last_name: profile._json.name.split(" ")[1] || " ",
          email: profile._json.email,
          password: " ",
          address: " ",
          age: 0,
          role: "user",
        };
        const dbResult = await UserModel.create(newUser);
        return done(null, dbResult);
      } else {
        return done(null, user);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});

//App ID: 315628

//Client ID: Iv1.b31ec3fe2305a7b3

//Client Secret:f747556b6aa038769714d1f6cdf431aba9f4b1c4
