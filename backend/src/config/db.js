import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log("Connected TO MONGODB SUCCESSFULLY 🚀");
  } catch (error) {
    console.log("Error connecting TO MONGODB");
    process.exit(1);
  }
};
