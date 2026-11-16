import { Router } from 'express';
import * as auth from "../controllers/auth.ts";
import { validateBody } from "../middlewares/validation.ts";

/**
 * @openapi
 * tags:
 *    - name: Auth
 *      description: Авторизация и аутентификация пользователей
 */
const router = Router();
const body = validateBody(["email", "password"]);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Вход пользователя
 *     description: Проверяет email и пароль зарегистрированного пользователя.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ivan@mail.ru
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: correct-horse-battery
 *     responses:
 *       200:
 *         description: Вход выполнен успешно
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Некорректное тело запроса
 *       401:
 *         description: Неверный email или пароль
 */
router.post("/login", body, auth.login);

export default router;