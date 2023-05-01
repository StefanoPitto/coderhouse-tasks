import jwt from "jsonwebtoken";
export const checkUserSocket = (socket) => {
  const { token } = socket;

  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwt.decode(token, process.env.SECRET_KEY);
    return decodedToken.role === "user";
  } catch (err) {
    return false;
  }
};
