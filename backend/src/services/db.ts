import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI as string;
  if (!uri) throw new Error("MONGODB_URI not set in environment variables");
  await mongoose.connect(uri, {
    dbName: process.env.DB_NAME || undefined,
  });
  isConnected = true;
  console.log("MongoDB connected");
}