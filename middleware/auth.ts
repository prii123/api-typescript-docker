import { NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { type } from "os";
import config from "../config";

export interface Response {
  message:string;
  json:any
}

export interface Request{
  verifiedUser:any;
  verified:string;
  headers:JwtPayload;
}



export const authenticate = (req: Request, res: Response, next: NextFunction):void => {

  // console.log(req.headers.authorization)
  const cabeceras: string = req.headers.authorization;
  // const token: string = req.headers.authorization?.split(" ")[1] || "";
  // console.log(token)

  try{
    if(!cabeceras){
      return res.json({ message: "No token provided" });
    }

    const token: string = req.headers.authorization?.split(" ")[1] || "";

    if (token) {
        try {
          const verified = jwt.verify(token, config.JWT_SECRET);
          console.log(verified)
          req.verifiedUser = verified;
          next();
        } catch (error) {
          console.error("error:", error);
        }
      }


  }catch(err){
    console.log(err)
  }

  // if (token) {
  //   try {
  //     const verified = jwt.verify(token, config.JWT_SECRET);
  //     console.log(verified)
  //     req.verifiedUser = verified;


  //     next();
  //   } catch (error) {
  //     console.error("error:", error);
  //   }
  // } else {

  //   next();
  //   return res.json({ message: "No token provided" });
  // }

};



