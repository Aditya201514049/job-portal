import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { authMiddleware, requireRole } from "@/lib/utils/middleware";

// GET - View all users
export async function GET(request) {
  try {
    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const roleCheck = requireRole(authResult.user, ["admin"]);
    if (roleCheck) {
      return NextResponse.json(
        { error: roleCheck.error },
        { status: roleCheck.status }
      );
    }

    await connectDB();

    const users = await User.find().select("-password");

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// PUT - Block/Unblock user
export async function PUT(request) {
  try {
    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const roleCheck = requireRole(authResult.user, ["admin"]);
    if (roleCheck) {
      return NextResponse.json(
        { error: roleCheck.error },
        { status: roleCheck.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Toggle block status
    user.isBlocked = !user.isBlocked;
    await user.save();

    return NextResponse.json(
      { message: `User ${user.isBlocked ? "blocked" : "unblocked"}`, user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
