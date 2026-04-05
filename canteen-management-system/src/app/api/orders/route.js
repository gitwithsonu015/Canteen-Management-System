import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";
import Order from "@/models/Order";

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

export async function GET(request) {
  try {
    await connectDB();
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const query = authUser.role === "admin" ? {} : { userId: authUser.userId };
    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders", error: error.message },
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

    const body = await request.json();
    const { items, totalPrice, paymentStatus } = body;

    if (!Array.isArray(items) || items.length === 0 || totalPrice === undefined) {
      return NextResponse.json(
        { success: false, message: "Items and totalPrice are required" },
        { status: 400 }
      );
    }

    const order = await Order.create({
      userId: authUser.userId,
      items,
      totalPrice,
      paymentStatus: paymentStatus || "unpaid",
      status: "pending",
    });

    return NextResponse.json(
      { success: true, message: "Order created", data: order },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to place order", error: error.message },
      { status: 500 }
    );
  }
}