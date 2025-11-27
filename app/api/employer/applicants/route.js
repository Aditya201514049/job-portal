import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/lib/models/Application";
import { authMiddleware, requireRole, requireApproval } from "@/lib/utils/middleware";

// GET - View applicants for a specific job
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

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const applications = await Application.find({ jobId }).populate({
      path: "jobSeekerId",
      select: "name email bio skills resumeURL",
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch applicants" },
      { status: 500 }
    );
  }
}
