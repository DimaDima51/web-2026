import jwt, { type JwtPayload } from "jsonwebtoken"
import { secret } from "../controllers/auth.ts"
import { User } from "../models/User.ts"

export const requireAuth = async (req, res, next) => {
    const match = /^Bearer ([^\s]+)$/i.exec(req.get("Authorization") ?? "")
    if (!match) {
        res.status(401).json({ error: "Передайте правильный токен" });
        return;
    }

    let payload: string | JwtPayload;
    try {
        payload = jwt.verify(match[1], secret);
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: "Передайте правильный токен" });
            return;
        }
        throw error;
    }

    if (typeof payload === "object" && payload !== null && typeof payload.email === "string") {
        const user = await User.exists({ email: payload.email });

        if (user) {
            req.user = user;
            next();
            return;
        }
    }

    res.status(401).json({ error: "Передайте правильный токен" });
}
