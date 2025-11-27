import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/lib/models/Application";
import { authMiddleware, requireRole } from "@/lib/utils/middleware";

// GET - View all applications (Read-only)
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

    const applications = await Application.find()
      .populate({
        path: "jobId",
        select: "title company location jobType",
        populate: {
          path: "employerId",
          select: "name email",
        },
      })
      .populate("jobSeekerId", "name email skills");

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
