import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import { authMiddleware, requireRole } from "@/lib/utils/middleware";

// GET - View all jobs (Read-only)
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

    const jobs = await Job.find().populate("employerId", "name email company");

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
