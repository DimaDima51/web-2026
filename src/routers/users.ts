import fs from 'fs';
import express, { type Request, type Response } from 'express';
import usersMiddleware from "../middlewares/users-middleware.ts";

const router = express.Router();

router.use(usersMiddleware);

// GET /user - все пользователи
// curl.exe --location --request GET "http://localhost:3000/user"
router.get('/', (req: Request, res: Response) => {
  fs.readFile('db.json', 'utf8', (err, userData) => {
    if (err) {
      res.status(500).send('Не удалось прочитать список пользователей');
      return;
    }

    res.send(userData);
  });
});

// POST - создание пользователя
// curl.exe --location "http://localhost:3000/user" --header "Content-Type: application/json" --data '{\"username\": \"test\", \"id\": \"123\"}'
router.post('/', (req: Request, res: Response) => {
  const { username, id } = req.body;

  if (!id || !username) {
    res.status(400).send('Требуется ID и юзернейм');
    return;
  }

  const rawFileData = fs.readFileSync('db.json', 'utf8');
  const userArray = JSON.parse(rawFileData);

  userArray.push({ id, username });
  fs.writeFileSync('db.json', JSON.stringify(userArray, null, 2), 'utf8');

  res.send(`Пользователь с юзернеймом ${username} и id = ${id} сохранен в "БД"`);
});

// PATCH - изменение никнейма пользователя
// curl.exe --location --request PATCH "http://localhost:3000/user/123" --header "Content-Type: application/json" --data "{\`"username\`": \`"new_test_name\`"}"
router.patch('/:id', (req: Request, res: Response) => {
  const userID = req.params.id;
  const { username } = req.body;

  if (!username) {
    res.status(400).send('Юзернейм не указан');
    return;
  }

  const rawFileData = fs.readFileSync('db.json', 'utf8');
  const userArray = JSON.parse(rawFileData);
  const foundUser = userArray.find((user: any) => user.id === userID);

  if (!foundUser) {
    res.status(404).send(`Пользователь с id = ${userID} не найден`);
    return;
  }

  foundUser.username = username;
  fs.writeFileSync('db.json', JSON.stringify(userArray, null, 2), 'utf8');

  res.send(`Никнейм пользователя с id = ${userID} успешно изменен на ${username}`);
});

// DELETE - удаление пользователя по его айди
// curl.exe --location --request DELETE "http://localhost:3000/user/123"
router.delete('/:id', (req: Request, res: Response) => {
  const userID = req.params.id;
  const rawFileData = fs.readFileSync('db.json', 'utf8');
  const userArray = JSON.parse(rawFileData);
  const foundUser = userArray.find((user: any) => user.id === userID);

  if (!foundUser) {
    res.status(404).send(`Пользователь с id = ${userID} не найден`);
    return;
  }

  const filteredUsers = userArray.filter((user: any) => user.id !== userID);
  fs.writeFileSync('db.json', JSON.stringify(filteredUsers, null, 2), 'utf8');

  res.send(`Пользователь с id = ${userID} успешно удален`);
});

// GET - информация о пользователе по его айди
// curl.exe --location --request GET "http://localhost:3000/user/123"
router.get('/:id', (req: Request, res: Response) => {
  const userID = req.params.id;
  const rawFileData = fs.readFileSync('db.json', 'utf8');
  const userArray = JSON.parse(rawFileData);
  const foundUser = userArray.find((user: any) => user.id === userID);

  if (!foundUser) {
    res.status(404).send(`Пользователь с id = ${userID} не найден`);
    return;
  }

  res.send(`Пользователь с id = ${foundUser.id} найден! Его юзернейм: ${foundUser.username}`);
});

export default router;
