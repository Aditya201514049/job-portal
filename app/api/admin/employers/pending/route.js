import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { authMiddleware, requireRole } from "@/lib/utils/middleware";

// GET - View pending employers
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

    const pendingEmployers = await User.find({
      role: "employer",
      isApproved: false,
    }).select("-password");

    return NextResponse.json(pendingEmployers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch pending employers" },
      { status: 500 }
    );
  }
}
