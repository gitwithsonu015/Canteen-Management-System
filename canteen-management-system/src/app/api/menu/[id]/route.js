import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";
import { deleteImage } from "@/lib/cloudinary";
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

export async function PUT(request, { params }) {
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

    const existingFood = await Food.findById(params.id);
    if (!existingFood) {
      return NextResponse.json(
        { success: false, message: "Food item not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const food = await Food.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (existingFood.imageKey && existingFood.imageKey !== body.imageKey) {
      try {
        await deleteImage(existingFood.imageKey);
      } catch {
        // Best-effort cleanup only.
      }
    }

    return NextResponse.json(
      { success: true, message: "Food item updated", data: food },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update food item", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    const food = await Food.findByIdAndDelete(params.id);
    if (!food) {
      return NextResponse.json(
        { success: false, message: "Food item not found" },
        { status: 404 }
      );
    }

    if (food.imageKey) {
      try {
        await deleteImage(food.imageKey);
      } catch {
        // Best-effort cleanup only.
      }
    }

    return NextResponse.json(
      { success: true, message: "Food item deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete food item", error: error.message },
      { status: 500 }
    );
  }
}