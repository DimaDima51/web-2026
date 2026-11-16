import mongoose from "mongoose";
import { config } from "../config.ts";

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUri);

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1); // Останавливаем процесс в случае ошибки подключения
    }
};

export default connectDB;
