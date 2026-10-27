import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/test-app");

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1); // Останавливаем процесс в случае ошибки подключения
    }
};

export default connectDB;
