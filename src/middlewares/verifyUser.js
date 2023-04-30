import jwt from "jsonwebtoken";
export const checkUser = (socket, next) => {
  console.log("KEY", process.env.SECRET_KEY);
  const { token } = socket;

  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwt.decode(token, process.env.SECRET_KEY);
    console.log(decodedToken.role === "user");
    return decodedToken.role === "user";
  } catch (err) {
    return false;
  }
};
