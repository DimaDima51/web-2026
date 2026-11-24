import { fileURLToPath } from "node:url";

export const config = {
  port: Number(process.env.PORT ?? 3001),
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/test-app",
  staticDir: fileURLToPath(new URL("../static/", import.meta.url)),
};
