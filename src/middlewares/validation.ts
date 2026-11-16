import type { RequestHandler } from "express";
import { HttpError } from "../utils/HttpError.ts";

export function validateBody(allowedFields: readonly string[]): RequestHandler {
  return (req, _res, next) => {
    const body: unknown = req.body;

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      next(new HttpError(400, "Тело запроса должно быть JSON-объектом"));
      return;
    }

    const keys = Object.keys(body);
    if (keys.length === 0) {
      next(new HttpError(400, "Тело запроса не должно быть пустым"));
      return;
    }

    const unexpectedField = keys.find((key) => !allowedFields.includes(key));
    if (unexpectedField) {
      next(new HttpError(400, `Неизвестное поле: ${unexpectedField}`));
      return;
    }

    next();
  };
}

export const validateObjectId: RequestHandler = (req, _res, next) => {
  const id = req.params.id;
  if (typeof id !== "string" || !/^[\da-f]{24}$/i.test(id)) {
    next(new HttpError(400, "Некорректный идентификатор"));
    return;
  }

  next();
};
