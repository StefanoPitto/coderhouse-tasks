import jwt from "jsonwebtoken";

export const checkAdminSocket = (socket) => {
  const { token } = socket;

  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwt.decode(token, process.env.SECRET_KEY);
    console.log(decodedToken.role === "admin");
    return decodedToken.role === "admin";
  } catch (err) {
    return false;
  }
};

export const checkAdminRoutes = (req, res, next) => {
  const { token } = socket;

  if (!token) {
    return res.status(403).json({ msg: "Not allowed." });
  }

  try {
    const decodedToken = jwt.decode(token, process.env.SECRET_KEY);
    console.log(decodedToken.role === "user");
    if (decodedToken.role === "admin") next();
    else return res.status(403).json({ msg: "Not an ADMIN" });
  } catch (err) {
    console.log(err);
  }
};
