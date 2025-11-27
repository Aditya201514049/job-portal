import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import { authMiddleware, requireRole, requireApproval } from "@/lib/utils/middleware";

// GET - Browse all jobs with filtering
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const jobType = searchParams.get("jobType");

    // Build filter
    const filter = {};
    if (location) filter.location = location;
    if (jobType) filter.jobType = jobType;

    const jobs = await Job.find(filter).populate("employerId", "name email company");

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST - Create a new job (Employer only)
export async function POST(request) {
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

    const { title, company, location, jobType, salaryRange, description } =
      await request.json();

    // Validation
    if (!title || !company || !location || !jobType || !salaryRange || !description) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const job = new Job({
      title,
      company,
      location,
      jobType,
      salaryRange,
      description,
      employerId: authResult.user._id,
    });

    await job.save();

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
