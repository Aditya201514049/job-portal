import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import { authMiddleware, requireRole, requireApproval } from "@/lib/utils/middleware";

// GET - View employer's own jobs
export async function GET(request) {
  try {
    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const roleCheck = requireRole(authResult.user, ["employer"]);
    if (roleCheck) {
      return NextResponse.json(
        { error: roleCheck.error },
        { status: roleCheck.status }
      );
    }

    const approvalCheck = requireApproval(authResult.user);
    if (approvalCheck) {
      return NextResponse.json(
        { error: approvalCheck.error },
        { status: approvalCheck.status }
      );
    }

    await connectDB();

    const jobs = await Job.find({ employerId: authResult.user._id });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
