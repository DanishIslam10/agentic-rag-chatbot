import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is missing");
        }

        const connection = await mongoose.connect(
            process.env.MONGODB_URL,
            {
                serverSelectionTimeoutMS: 5000,
            }
        );
        
        console.log(
              `MongoDB Connected: ${connection.connection.host}`
        );

    } catch (error) {

        console.log(
            "MongoDB connection failed:",
            error.message
        );

        process.exit(1);
    }
};

export default connectDB;