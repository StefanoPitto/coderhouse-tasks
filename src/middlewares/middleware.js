import jwt from "jsonwebtoken";
export const validateJWT = (req, res, next) => {
  const token = req.header("x-token");

  console.log(token);

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
