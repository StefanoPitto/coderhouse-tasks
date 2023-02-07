import { response } from "express";
import { validationResult } from "express-validator";

export const fieldsValidation = (req, res = response, next) => {
  //Errors handling
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }
  next();
};
