"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";

export default function Header() {
  const { user, signOut } = useAuth() || {};

  return (
    <header className="sticky top-0 z-30 border border-white/50 bg-white/80 backdrop-blur-md shadow-sm rounded-2xl px-6 py-3">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
            JP
          </span>
          Job Portal
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/" className="btn btn-ghost text-sm">
            Browse Jobs
          </Link>
          {!user && (
            <>
              <Link href="/login" className="btn btn-primary text-sm">
                Login
              </Link>
              <Link href="/register" className="btn btn-ghost text-sm">
                Join Now
              </Link>
            </>
          )}
          {user && (
            <>
              {user.role === "jobseeker" && (
                <Link href="/jobseeker/dashboard" className="btn btn-ghost text-sm">
                  Dashboard
                </Link>
              )}
              {user.role === "employer" && (
                <Link href="/employer/dashboard" className="btn btn-ghost text-sm">
                  Dashboard
                </Link>
              )}
              {user.role === "admin" && (
                <Link href="/admin/dashboard" className="btn btn-ghost text-sm">
                  Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                className="subtle hover:opacity-80"
              >
                {user.name} ({user.role})
              </Link>
              <button className="btn btn-ghost text-sm" onClick={signOut}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
