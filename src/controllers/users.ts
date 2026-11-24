import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { Order } from "../models/Order.ts";
import { User } from "../models/User.ts";
import { HttpError } from "../utils/HttpError.ts";
import { parseUserInput } from "../utils/user-input.ts";

export async function listUsers(_req: Request, res: Response) {
  const users = await User.find();
  res.status(200).send(users);
}

export async function createUser(req: Request, res: Response) {
  const input = parseUserInput(req.body);
  const password = req.body.password;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({...input, passwordHash});
  res.status(201).send(user);
}

export async function updateUser(req: Request, res: Response) {
  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body) ||
    Object.keys(req.body).length === 0
  ) {
    throw new HttpError(400, "Передайте name и/или email для обновления");
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new HttpError(404, "Пользователь не найден");

  user.set(parseUserInput(req.body, true));
  await user.save();
  res.status(200).send(user);
}

export async function deleteUser(req: Request, res: Response) {
  if (await Order.exists({ user: req.params.id })) {
    throw new HttpError(409, "Сначала удалите заказы пользователя");
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new HttpError(404, "Пользователь не найден");
  res.status(200).send(`Пользователь с id = ${req.params.id} успешно удален`);
}

export async function getUser(req: Request, res: Response) {
  const user = await User.findById(req.params.id);
  if (!user) throw new HttpError(404, "Пользователь не найден");
  res.status(200).send(user);
}
