import fs from 'fs';
import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();

const PORT = 3000;

app.use(express.json())

// логи
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// PATCH - изменение никнейма пользователя
// curl.exe --location --request PATCH "http://localhost:3000/user/123" --header "Content-Type: application/json" --data "{\`"username\`": \`"new_test_name\`"}"
app.patch('/user/:id', (req: Request, res: Response) => {

  const userID = req.params.id;
  const { username } = req.body;

  if (!username) {
    res.status(400)
    res.send('Юзернейм не указан')
    return;
  }

  const rawFileData = fs.readFileSync('db.json', 'utf8');
  const userArray = JSON.parse(rawFileData);

  const foundUser = userArray.find((user: any) => user.id === userID);

  if (!foundUser) {
    res.status(404)
    res.send(`Пользователь с id = ${userID} не найден`);
    return;
  }

  foundUser.username = username;

  fs.writeFileSync('db.json', JSON.stringify(userArray, null, 2), 'utf8');

  res.send(`Никнейм пользователя с id = ${userID} успешно изменен на ${username}`);
});

// DELETE - удаление пользователя по его айди
// curl.exe --location --request DELETE "http://localhost:3000/user/123"
app.delete('/user/:id', (req: Request, res: Response) => {
  const userID = req.params.id;

  const rawFileData = fs.readFileSync('db.json', 'utf8');
  const userArray = JSON.parse(rawFileData);

  const foundUser = userArray.find((user: any) => user.id === userID);

  if (!foundUser) {
    res.status(404)
    res.send(`Пользователь с id = ${userID} не найден`);
    return;
  }

  const filteredUsers = userArray.filter((user: any) => user.id !== userID);

  fs.writeFileSync('db.json', JSON.stringify(filteredUsers, null, 2), 'utf8');

  res.send(`Пользователь с id = ${userID} успешно удален`);
});

// POST - создание пользователя
// curl.exe --location "http://localhost:3000/user" --header "Content-Type: application/json" --data '{\"username\": \"test\", \"id\": \"123\"}'
app.post('/user', (req: Request, res: Response) => {
  const { username, id } = req.body

  if (!id || !username) {
    res.status(400)
    res.send('Требуется ID и юзернейм')
    return;
  }

  const rawFileData = fs.readFileSync('db.json', 'utf8');
  const userArray = JSON.parse(rawFileData);

  userArray.push({ id, username });

  fs.writeFileSync('db.json', JSON.stringify(userArray, null, 2), 'utf8');

  res.send(`Пользователь с юзернеймом ${username} и id = ${id} сохранен в "БД"`);

});

// GET - информация о пользователе по его айди
// curl.exe --location --request GET "http://localhost:3000/user/123"
app.get('/user/:id', (req: Request, res: Response) => {
  const userID = req.params.id;

  const rawFileData = fs.readFileSync('db.json', 'utf8');
  const userArray = JSON.parse(rawFileData);

  const foundUser = userArray.find((user: any) => user.id === userID);

  if (!foundUser) {
    res.status(404)
    res.send(`Пользователь с id = ${userID} не найден`);
    return;
  }

  res.send(`Пользователь с id = ${foundUser.id} найден! Его юзернейм: ${foundUser.username}`);
});

// GET /user - все пользователи
// curl.exe --location --request GET "http://localhost:3000/user"
app.get('/user', (req: Request, res: Response) => {

  fs.readFile('db.json', 'utf8', (err, userData) => {
    if (err) throw err;
    res.send(userData);
  });

});

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`)
});