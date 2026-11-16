import { HttpError } from "./HttpError.ts";

export interface UserInput {
  name: string;
  email: string;
}

export function parseUserInput(
  body: Partial<UserInput>,
  partial = false,
): Partial<UserInput> {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new HttpError(400, "Тело запроса должно быть JSON-объектом");
  }

  const result: Partial<UserInput> = {};

  if (!partial || body.name !== undefined) {
    if (
      typeof body.name !== "string" ||
      !body.name.trim() ||
      body.name.trim().length > 100
    ) {
      throw new HttpError(400, "name должен быть строкой длиной от 1 до 100 символов");
    }
    result.name = body.name.trim();
  }

  if (!partial || body.email !== undefined) {
    if (
      typeof body.email !== "string" ||
      body.email.trim().length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
    ) {
      throw new HttpError(400, "Передайте корректный email");
    }
    result.email = body.email.trim().toLowerCase();
  }

  return result;
}
