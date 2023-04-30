import jwt from "jsonwebtoken";

export const checkAdmin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (decodedToken.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You do not have the required permissions" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
