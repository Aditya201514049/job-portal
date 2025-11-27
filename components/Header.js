"use client";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils/apiClient";
import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";

export default function Header() {
  const { user, signOut } = useAuth() || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiFetch("/api/auth/user", { method: "GET" })
      .then((res) => {
        if (res.status === 200) {
          console.log("User data fetched");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
        setLoading(false);
      });
  }, []);

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 border-b mb-4">
      <Link href="/" className="font-bold text-lg">Job Portal</Link>
      <nav className="flex gap-4 items-center">
        {!user && <>
          <Link href="/login" className="text-blue-600">Login</Link>
          <Link href="/register" className="text-blue-600">Register</Link>
        </>}
        {user && <>
          <span className="text-gray-700">{user.name} ({user.role})</span>
          <button className="text-red-600" onClick={signOut}>Logout</button>
        </>}
      </nav>
    </header>
  );
}
