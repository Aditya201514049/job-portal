import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/lib/models/Application";
import Job from "@/lib/models/Job";
import User from "@/lib/models/User";
import { authMiddleware, requireRole } from "@/lib/utils/middleware";

// POST - Apply to a job (Job Seeker only)
export async function POST(request) {
  try {
    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const roleCheck = requireRole(authResult.user, ["jobseeker"]);
    if (roleCheck) {
      return NextResponse.json(
        { error: roleCheck.error },
        { status: roleCheck.status }
      );
    }

    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      jobSeekerId: authResult.user._id,
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 400 }
      );
    }

    // Create application
    const application = new Application({
      jobId,
      jobSeekerId: authResult.user._id,
    });

    await application.save();

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to apply to job" },
      { status: 500 }
    );
  }
}

// GET - View applied jobs (Job Seeker only)
export async function GET(request) {
  try {
    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const roleCheck = requireRole(authResult.user, ["jobseeker"]);
    if (roleCheck) {
      return NextResponse.json(
        { error: roleCheck.error },
        { status: roleCheck.status }
      );
    }

    await connectDB();

    const applications = await Application.find({
      jobSeekerId: authResult.user._id,
    }).populate({
      path: "jobId",
      select: "title company location jobType salaryRange description",
      populate: {
        path: "employerId",
        select: "name email company",
      },
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
