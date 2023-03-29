import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
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
      const { name, age, address, role } = req.body;
      if (user) {
        return done(null, false);
      }
      const hashedPassword = await hash(password, 10);
      const newUser = {
        first_name: name.split(" ")[0],
        last_name: name.split(" ")[1],
        age,
        email,
        password: hashedPassword,
        address,
        role,
      };
      const newUserDB = await UserModel.create(newUser);
      done(null, newUserDB);
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
      try {
        // Check if user exists in the database
        const user = await User.findOne({ email });

        if (!user) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if the provided password matches the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate a JWT token and send it back in the response
        const token = jwt.sign({ userId: user._id }, "s3Cr3Tk3Y!&*S^F");
        res.json({ token });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
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
  new GithubStrategy(
    {
      clientID: "Iv1.20237976621ec5c1",
      clientSecret: "f6162e1f7637528f37dd09967a0630b8ac2f6d86",
      callbackURL: "http://localhost:8080/api/auth/github",
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
        const dbResult = await UserModel.create(newUser);
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

// Export Passport instance
export default passport;
