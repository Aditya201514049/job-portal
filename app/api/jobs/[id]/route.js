import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import { authMiddleware, requireRole, requireApproval } from "@/lib/utils/middleware";

// PUT - Update job (Employer only, own jobs)
export async function PUT(request) {
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
    const jobId = searchParams.get("id");

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const { title, company, location, jobType, salaryRange, description } =
      await request.json();

    await connectDB();

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if the job belongs to the employer
    if (job.employerId.toString() !== authResult.user._id.toString()) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update fields
    if (title) job.title = title;
    if (company) job.company = company;
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;
    if (salaryRange) job.salaryRange = salaryRange;
    if (description) job.description = description;

    await job.save();

    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// DELETE - Delete job (Employer only, own jobs)
export async function DELETE(request) {
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

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("id");

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if the job belongs to the employer
    if (job.employerId.toString() !== authResult.user._id.toString()) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await Job.findByIdAndDelete(jobId);

    return NextResponse.json({ message: "Job deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
