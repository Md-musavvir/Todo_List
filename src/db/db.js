import mongoose from "mongoose";
import dotenv from "dotenv";
import DB_name from "./../constants.js";
dotenv.config();

const connectDb = async () => {
  try {
    const dbConnection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_name}`
    );
    console.log(dbConnection.connection.host);
  } catch (error) {
    console.log("Failed to connect database");
  }
};
export default connectDb;
