import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,{
        dbName: "attendai",
    });
    console.log("MongoDB Connected Successfully 🟢");
  } catch (error) {
    console.error("DB Connection Failed 🔴", error);
    process.exit(1);
  }
};

export default connectDB;