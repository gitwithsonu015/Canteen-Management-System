import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";
import Food from "@/models/Food";

function getAuthUser(request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    await connectDB();
    const foods = await Food.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: foods }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch menu", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (authUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, price, category, image, imageKey, available } = body;
    if (!name || price === undefined || !category) {
      return NextResponse.json(
        { success: false, message: "Name, price, and category are required" },
        { status: 400 }
      );
    }

    const food = await Food.create({
      name,
      price,
      category,
      image: image || "",
      imageKey: imageKey || "",
      available: available ?? true,
    });

    return NextResponse.json(
      { success: true, message: "Food item added", data: food },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create food item", error: error.message },
      { status: 500 }
    );
  }
}