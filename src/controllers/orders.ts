import type { Request, Response } from "express";
import { Order } from "../models/Order.ts";
import { Product } from "../models/Product.ts";
import { User } from "../models/User.ts";
import { HttpError } from "../utils/HttpError.ts";

type OrderItemInput = {
  product: string;
  quantity: number;
};

async function prepareItems(items: unknown) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, "Заказ должен содержать хотя бы один товар");
  }

  const prepared = [];
  let total = 0;

  for (const item of items as Partial<OrderItemInput>[]) {
    if (
      typeof item?.product !== "string" ||
      typeof item.quantity !== "number" ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1
    ) {
      throw new HttpError(400, "Каждая позиция должна содержать product и целое quantity больше 0");
    }

    const product = await Product.findById(item.product);
    if (!product) throw new HttpError(404, `Товар ${item.product} не найден`);

    const lineTotal = product.price * item.quantity;
    total += lineTotal;
    if (!Number.isSafeInteger(total)) {
      throw new HttpError(400, "Сумма заказа слишком велика");
    }

    prepared.push({
      product: product._id,
      quantity: item.quantity,
      unitPrice: product.price,
    });
  }

  return { items: prepared, total };
}

export async function listOrders(_req: Request, res: Response) {
  const orders = await Order.find();
  res.status(200).send(orders);
}

export async function createOrder(req: Request, res: Response) {
  const userId = req.body?.user;
  if (typeof userId !== "string") {
    throw new HttpError(400, "Передайте идентификатор пользователя в поле user");
  }

  const user = await User.findById(userId);
  if (!user) throw new HttpError(404, "Пользователь не найден");

  const { items, total } = await prepareItems(req.body.items);
  const order = await Order.create({ user: user._id, items, total });
  res.status(201).send(order);
}

export async function updateOrder(req: Request, res: Response) {
  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body) ||
    !Object.keys(req.body).some((key) => key === "items" || key === "status") ||
    Object.keys(req.body).some((key) => key !== "items" && key !== "status")
  ) {
    throw new HttpError(400, "Обновление должно содержать items и/или status");
  }

  const order = await Order.findById(req.params.id);
  if (!order) throw new HttpError(404, "Заказ не найден");

  if (req.body?.items !== undefined) {
    const { items, total } = await prepareItems(req.body.items);
    order.set({ items, total });
  }

  if (req.body?.status !== undefined) {
    order.set({ status: req.body.status });
  }

  await order.save();
  res.status(200).send(order);
}

export async function deleteOrder(req: Request, res: Response) {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) throw new HttpError(404, "Заказ не найден");
  res.status(200).send(`Заказ с id = ${req.params.id} успешно удален`);
}

export async function getOrder(req: Request, res: Response) {
  const order = await Order.findById(req.params.id);
  if (!order) throw new HttpError(404, "Заказ не найден");
  res.status(200).send(order);
}
