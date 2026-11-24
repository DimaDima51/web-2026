import express from 'express';
import { pathToFileURL } from "node:url";
import usersRouter from "./routers/users.ts";
import productsRouter from "./routers/products.ts";
import ordersRouter from "./routers/orders.ts";
import logger from "./middlewares/logger.ts";
import connectDB from "./utils/connectDB.ts";
import { config } from "./config.ts";
import { errorHandler, notFound } from "./middlewares/error-handler.ts";
import swaggerUi from 'swagger-ui-express'
import { openapiSpecification } from './utils/swagger.ts'
import authRouter from './routers/auth.ts'

export function createApp() {
  const app = express();
  app.use(logger);
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: false, limit: "100kb" }));

  app.get("/openapi.json", (_req, res) => res.json(openapiSpecification));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
  app.use("/users", usersRouter);
  app.use("/products", productsRouter);
  app.use("/orders", ordersRouter);
  app.use("/auth", authRouter);

  app.get("/about", (_req, res) => {
    res.sendFile("about.html", { root: config.staticDir });
  });
  app.get("/index", (_req, res) => {
    res.sendFile("index.html", { root: config.staticDir });
  });
  app.use(express.static(config.staticDir));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await connectDB();
  createApp().listen(config.port, () => {
    console.log(`App listening on ${config.port}`);
  });
}
