import { response } from "express";

export const verifyStringArray = (req, res = response, next) => {
  if (!req.body.thumbnail) {
    next();
    return;
  }
  if (
    Array.isArray(req.body.thumbnail) &&
    req.body.length > 0 &&
    req.body.thumbnail.every((item) => typeof item === "string")
  ) {
    next();
  } else {
    return res.status(400).send("Array must contain only strings");
  }
};
