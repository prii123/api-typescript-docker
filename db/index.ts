import mongoose from "mongoose";
import config from "../config";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("Mongodb connected");
  } catch (error) {
    console.error(error);
  }
};

export default { connectDB };