import {createJWTToken} from "../util/auth";
import { comparePassword} from "../util/bcrypt";
import User from "../models/User";
import { Request, Response } from "express";

declare module 'express-serve-static-core' {

interface Request {
    email: string,
    password: string,
}
interface Response {
    data: any
}
}
export const login = async (req: Request, res: Response) => {

    const email = req.body.email;
    const password = req.body.password;

    // console.log(email + password)

        const user = await User.findOne({ email }).select("+password");
        // console.log(user)
        // if (!user) throw new Error("Invalid Username");
        if (!user) {
            return res.status(200).json('Invalid');
        } //
        // if (!user) return "Invalid";

        const validPassword = await comparePassword(password, user.password);
        // console.log(validPassword)
        // if (!validPassword) throw new Error("Invalid Password");
        if (!validPassword) return res.status(200).json("Invalid");

        const token = createJWTToken({
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
        });
    
        const data:any = token + " " + user.email;
        console.log(data)

        return res.status(200).json(data);
}