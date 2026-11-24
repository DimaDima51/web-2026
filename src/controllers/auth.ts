import type { Request, Response } from "express";
import { User } from "../models/User.ts";
import bcrypt from "bcrypt";
import { HttpError } from "../utils/HttpError.ts";
import jwt from "jsonwebtoken";

export const secret = "asdasdasdasd123123";

export async function login (req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
    if (typeof email !== "string" || typeof password !== "string") {
        throw new HttpError(400, "Передайте email и пароль");
    }

    const user = await User.findOne({ email }).select("+passwordHash");
    
    const comparePassword = await bcrypt.compare(password, user?.passwordHash ?? "");
    
    if (!user || !user.passwordHash || !comparePassword) {
        res.status(401);
        res.send({error: "Неверный email или пароль"});
        return;
    }

    const accessToken = jwt.sign({id: user._id, email: user.email}, secret, {algorithm: "HS256", issuer: "web-2026"});


    res.status(200).json({user, accessToken});
}