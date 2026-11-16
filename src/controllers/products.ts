import type { Request, Response } from "express";
import { Order } from "../models/Order.ts";
import { Product } from "../models/Product.ts";
import { HttpError } from "../utils/HttpError.ts";

export async function listProducts(_req: Request, res: Response) {
  const products = await Product.find();
  res.status(200).send(products);
}

export async function createProduct(req: Request, res: Response) {
  const product = await Product.create(req.body);
  res.status(201).send(product);
}

export async function updateProduct(req: Request, res: Response) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new HttpError(404, "Товар не найден");
  res.status(200).send(product);
}

export async function deleteProduct(req: Request, res: Response) {
  if (await Order.exists({ "items.product": req.params.id })) {
    throw new HttpError(409, "Нельзя удалить товар, который есть в заказах");
  }

  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new HttpError(404, "Товар не найден");
  res.status(200).send(`Товар с id = ${req.params.id} успешно удален`);
}

export async function getProduct(req: Request, res: Response) {
  const product = await Product.findById(req.params.id);
  if (!product) throw new HttpError(404, "Товар не найден");
  res.status(200).send(product);
}
