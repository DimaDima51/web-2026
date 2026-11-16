import { Schema, model } from "mongoose";

export const orderStatuses = ["new", "processing", "completed", "cancelled"] as const;

export const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  unitPrice: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
}, { _id: false, strict: "throw" });

export const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: (items: unknown[]) => items.length > 0,
  },
  status: { type: String, enum: orderStatuses, default: "new", required: true },
  total: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
}, { timestamps: true, versionKey: false, strict: "throw" });

export const Order = model("Order", orderSchema);
