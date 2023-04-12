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
