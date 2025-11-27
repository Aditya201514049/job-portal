import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { authMiddleware, requireRole } from "@/lib/utils/middleware";

// PUT - Approve employer
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
    const employerId = searchParams.get("id");
    const { action } = await request.json();

    if (!employerId || !action) {
      return NextResponse.json(
        { error: "Employer ID and action are required" },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    await connectDB();

    const employer = await User.findById(employerId);
    if (!employer) {
      return NextResponse.json(
        { error: "Employer not found" },
        { status: 404 }
      );
    }

    if (employer.role !== "employer") {
      return NextResponse.json(
        { error: "User is not an employer" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      employer.isApproved = true;
      await employer.save();
      return NextResponse.json(
        { message: "Employer approved", employer },
        { status: 200 }
      );
    }

    if (action === "reject") {
      await User.findByIdAndDelete(employerId);
      return NextResponse.json(
        { message: "Employer rejected and removed" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process employer request" },
      { status: 500 }
    );
  }
}
