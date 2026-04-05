import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";
import { uploadImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

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

export async function POST(request) {
  try {
    await connectDB();

    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (authUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, message: "Image file is required" }, { status: 400 });
    }

    const result = await uploadImage(file);

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded",
        data: {
          image: result.secure_url,
          imageKey: result.public_id,
          width: result.width,
          height: result.height,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to upload image", error: error.message },
      { status: 500 }
    );
  }
}