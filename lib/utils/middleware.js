import { NextResponse } from "next/server";
import { verifyToken } from "./auth";
import { connectDB } from "../db";
import User from "../models/User";

export async function authMiddleware(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return { error: "No token provided", status: 401 };
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return { error: "Invalid token", status: 401 };
    }

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return { error: "User not found", status: 404 };
    }

    if (user.isBlocked) {
      return { error: "Your account has been blocked", status: 403 };
    }

    return { user };
  } catch (error) {
    return { error: "Authentication failed", status: 500 };
  }
}

export function requireRole(user, allowedRoles) {
  if (!allowedRoles.includes(user.role)) {
    return { error: "Unauthorized access", status: 403 };
  }
  return null;
}

export function requireApproval(user) {
  if (user.role === "employer" && !user.isApproved) {
    return { error: "Your account is pending approval by the admin", status: 403 };
  }
  return null;
}