"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function Header() {
  const { user, signOut } = useAuth() || {};
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut?.();
    router.push("/login");
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-30 border border-white/50 bg-white/80 backdrop-blur-md shadow-sm rounded-2xl px-6 py-3">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
            JP
          </span>
          Job Portal
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-3">
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
              <button className="btn btn-ghost text-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile Hamburger Button - Visible on mobile only */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Popup - Visible on mobile when menu is open */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              className="btn btn-ghost text-sm justify-start"
              onClick={closeMenu}
            >
              Browse Jobs
            </Link>
            {!user && (
              <>
                <Link
                  href="/login"
                  className="btn btn-primary text-sm justify-start"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-ghost text-sm justify-start"
                  onClick={closeMenu}
                >
                  Join Now
                </Link>
              </>
            )}
            {user && (
              <>
                {user.role === "jobseeker" && (
                  <Link
                    href="/jobseeker/dashboard"
                    className="btn btn-ghost text-sm justify-start"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "employer" && (
                  <Link
                    href="/employer/dashboard"
                    className="btn btn-ghost text-sm justify-start"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="btn btn-ghost text-sm justify-start"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="btn btn-ghost text-sm justify-start subtle"
                  onClick={closeMenu}
                >
                  {user.name} ({user.role})
                </Link>
                <button
                  className="btn btn-ghost text-sm justify-start text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
