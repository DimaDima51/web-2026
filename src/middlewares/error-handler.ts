import type { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";
import { HttpError } from "../utils/HttpError.ts";

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: error.message });
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    res.status(409).json({ error: "Запись с такими данными уже существует" });
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error.status === 400 || error.status === 413)
  ) {
    res.status(error.status).json({
      error: error.status === 413 ? "Тело запроса слишком большое" : "Некорректный запрос",
    });
    return;
  }

  console.error("Request failed:", error);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
};
