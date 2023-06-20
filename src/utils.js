import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
export const __dirname = dirname(fileURLToPath(import.meta.url));

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      age: user.age,
      email: user.email,
      address: user.address,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
};

export const uploadFile = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let folder;
      if (file.fieldname === "profileImage") {
        folder = "profiles";
      } else if (file.fieldname === "productImage") {
        folder = "products";
      } else {
        folder = "documents";
      }
      cb(null, `uploads/${folder}`);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

export const generateRandomString = (length) => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};
