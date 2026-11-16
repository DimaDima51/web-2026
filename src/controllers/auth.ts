import type { Request, Response } from "express";
import { User } from "../models/User.ts";
import bcrypt from "bcrypt";
import { HttpError } from "../utils/HttpError.ts";

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

    res.status(200).send(user);
}