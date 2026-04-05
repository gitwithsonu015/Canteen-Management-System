import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email is already registered" },
        { status: 409 }
      );
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "user",
    });

    const token = signToken({ userId: user._id.toString(), role: user.role });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register API error:", error);

    const isConnectivityIssue =
      error.message.includes("MongoDB DNS lookup failed") ||
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("ENOTFOUND");

    return NextResponse.json(
      {
        success: false,
        message: isConnectivityIssue
          ? "Database connection failed. Check MONGODB_URI/network and restart server."
          : "Registration failed",
        error: error.message,
      },
      { status: isConnectivityIssue ? 503 : 500 }
    );
  }
}