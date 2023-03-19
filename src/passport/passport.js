import passport, { Strategy as LocalStrategy } from "passport";
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
      const user = await userModel.findOne({ email });
      if (user) {
        return done(null, false);
      }
      const hashedPassword = await hash(password, 10);
      const newUser = { ...req.body, password: hashedPassword };
      const newuserBD = await userModel.create(newUser);
      done(null, newuserBD);
    }
  )
);

passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: "Iv1.db08b796b4e9bbed",
      clientSecret: "1deb8dbc553093bd13def9b3b561f5f5e8e8d68c",
      callbackURL: "http://localhost:8080/api/auth/githubUsers",
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await usersModel.findOne({ email: profile._json.email });
      if (!user) {
        const newUser = {
          first_name: profile._json.name.split(" ")[0],
          last_name: profile._json.name.split(" ")[1] || " ",
          email: profile._json.email,
          password: " ",
          address: null,
          age: null,
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
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});
