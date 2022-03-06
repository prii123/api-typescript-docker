import jwt from "jsonwebtoken";
import config from "../config";

export const createJWTToken = (user: any) => {
  return jwt.sign({ user }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

