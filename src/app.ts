import express, { type Express } from 'express';
import users from "./routers/users.ts";
import logger from "./middlewares/logger.ts";
import connectDB from "./utils/connectDB.ts";

const app: Express = express();

const PORT = Number(process.env.PORT ?? 3001);

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

app.use('/users', users);

app.get("/about", (req, res) => {
  res.sendFile("about.html", {root: "static"});
});

app.get("/index", (req, res) => {
  res.sendFile("index.html", {root: "static"});
});

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`)
});

connectDB()