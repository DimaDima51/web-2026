import express, { type Request, type Response } from 'express';
import usersMiddleware from "../middlewares/users-middleware.ts";
import { User } from '../models/User.ts';

const router = express.Router();

router.use(usersMiddleware);

// GET - получение всех пользователей
// curl.exe "http://localhost:3001/users"
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
