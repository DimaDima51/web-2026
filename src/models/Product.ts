import { Schema, model } from "mongoose";

export const productSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, default: "", maxlength: 2000, validate: (value: string) => typeof value === "string" },
  price: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
  stock: { type: Number, default: 0, min: 0, validate: Number.isSafeInteger },
}, { timestamps: true, versionKey: false, strict: "throw" });

export const Product = model("Product", productSchema);
