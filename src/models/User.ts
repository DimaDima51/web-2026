import { Schema, model } from "mongoose";

export const userSchema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    passwordHash: {
        type: String,
        required: true,
        select: false
    }
}, { timestamps: true, versionKey: false, strict: "throw" });

userSchema.set("toJSON", {
    transform(_document, result) {
        const { passwordHash, ...publicUser } = result
        return publicUser
    }
});

export const User = model("User", userSchema);
