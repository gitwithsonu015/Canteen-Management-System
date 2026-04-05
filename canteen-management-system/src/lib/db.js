import mongoose from "mongoose";
import dns from "dns"
dns.setServers(["8.8.8.8", "1.1.1.1"])
const MONGODB_URI = process.env.MONGODB_URI|| "mongodb://localhost:27017/nextjs-blog";

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}