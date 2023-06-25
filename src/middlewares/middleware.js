import jwt from "jsonwebtoken";

export const validateJWT = (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No token",
    });
  }
  try {
    const { _id, name } = jwt.verify(token, process.env.SECRET_KEY);
    req._id = _id;
    req.name = name;
  } catch (err) {
    return res.status(401).json({
      ok: false,
      msg: "Invalid token",
    });
  }

  next();
};



export const verifyToken = (req, res, next) => {
  // Get the bearer token from the request headers
  const bearerToken = req.headers.authorization;

  // Check if the token is present and starts with "Bearer "
  if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Extract the token value
  const token = bearerToken.split(" ")[1];

  try {
    // Verify the token using your preferred method (e.g., JWT verification)
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if(decoded.expiration_time < new Date().getTime())
    return res.status(401).json({ message: "Token expired" });

    // Call the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors
    return res.status(401).json({ message: "Invalid token" });
  }
};
