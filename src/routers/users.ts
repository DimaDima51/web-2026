import express, { type Request, type Response } from 'express';
import usersMiddleware from "../middlewares/users-middleware.ts";
import { User } from '../models/User.ts';

const router = express.Router();

router.use(usersMiddleware);

// GET - получение всех пользователей
// curl.exe "http://localhost:3001/users"
/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Получение всех пользователей
 *     description: Возвращает всех пользователей из базы данных
 *     responses:
 *       200:
 *         description: Список пользователей успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Ошибка при получении списка пользователей
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send('Ошибка при получении пользователей');
  }
});

// POST - создание пользователя
// curl.exe -X POST -d "name=curl&email=curl@mail.ru" "http://localhost:3001/users"
/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Создание пользователя
 *     description: Создаёт нового пользователя и сохраняет его в базе данных
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: curl
 *               email:
 *                 type: string
 *                 format: email
 *                 example: curl@mail.ru
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Ошибка при создании пользователя
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201);
    res.send(user);
  } catch (error) {
    res.status(500).send('Ошибка при создании пользователя');
  }
});

// PATCH - изменение никнейма И/ИЛИ почты пользователя
// curl.exe -X PATCH -d "name=super_curl" "http://localhost:3001/users/6acdf089366930e5d6703f6f"
// curl.exe -X PATCH -d "email=super_curl@mail.ru" "http://localhost:3001/users/6acdf089366930e5d6703f6f"
// curl.exe -X PATCH -d "name=super_curl&email=super_curl@mail.ru" "http://localhost:3001/users/6acdf089366930e5d6703f6f"
/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Обновление пользователя
 *     description: Обновляет имя и/или электронную почту пользователя по его идентификатору
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Идентификатор пользователя в MongoDB
 *         schema:
 *           type: string
 *         example: 6acdf089366930e5d6703f6f
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: super_curl
 *               email:
 *                 type: string
 *                 format: email
 *                 example: super_curl@mail.ru
 *             minProperties: 1
 *     responses:
 *       200:
 *         description: Пользователь успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Ошибка при обновлении пользователя
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200);
    res.send(user);
  } catch (error) {
    res.status(500).send('Ошибка при обновлении пользователя');
  }
});

// DELETE - удаление пользователя по его айди
// curl.exe -X DELETE "http://localhost:3001/users/6acdf089366930e5d6703f6f"
/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Удаление пользователя
 *     description: Удаляет пользователя из базы данных по его идентификатору
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Идентификатор пользователя в MongoDB
 *         schema:
 *           type: string
 *         example: 6acdf089366930e5d6703f6f
 *     responses:
 *       200:
 *         description: Запрос на удаление успешно обработан
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Пользователь с id = 6acdf089366930e5d6703f6f успешно удален
 *       500:
 *         description: Ошибка при удалении пользователя
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200);
    res.send(`Пользователь с id = ${req.params.id} успешно удален`);
  } catch (error) {
    res.status(500).send('Ошибка при удалении пользователя');
  }
});

// GET - информация о пользователе по его айди
// curl.exe "http://localhost:3001/users/6acdf089366930e5d6703f6f"
/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Получение пользователя по ID
 *     description: Возвращает информацию о пользователе по его идентификатору
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Идентификатор пользователя в MongoDB
 *         schema:
 *           type: string
 *         example: 6acdf089366930e5d6703f6f
 *     responses:
 *       200:
 *         description: Информация о пользователе успешно получена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Ошибка при получении пользователя
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200);
    res.send(user);
  } catch (error) {
    res.status(500).send('Ошибка при получении пользователя');
  }
});

export default router;

