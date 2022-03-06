import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.headers);

  // const token = req.header('token') //.authorization?.split(" ")[1] || "";
  // if (token) {
  //   try {
  //     const verified = jwt.verify(token, config.JWT_SECRET);
  //     req.verifiedUser = verified.user;
  //     next();
  //   } catch (error) {
  //     console.error("error:", error);
  //   }
  // } else {
  //   next()
    // return res.json({ message: "No token provided" });
  // }

};

export const testMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("test middleware");
  next();
}

