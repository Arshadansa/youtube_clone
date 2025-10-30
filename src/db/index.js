import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`\n mongoDB connected : ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("error in connecting with mongoDB", error);
    process.exit(1);
  }
};

export default connectDB;
