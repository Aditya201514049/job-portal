"use client";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils/apiClient";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { signIn, user } = useAuth() || {};
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const { status, data } = await apiFetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (status === 200 && data?.token) {
      signIn?.({ token: data.token, user: data.user });
      router.replace("/");
      return;
    }

    setError(data?.error || "Login failed");
  };

  if (user) {
    return <div className="glass-panel max-w-md mx-auto mt-12">Redirecting...</div>;
  }

  return (
    <main className="flex items-center justify-center">
      <div className="glass-panel w-full max-w-md space-y-5">
        <div>
          <p className="subtle">Welcome back</p>
          <h1 className="text-2xl font-semibold">Sign in to continue</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium">
            Email
            <input
              className="input mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              type="password"
              className="input mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <div className="text-red-600">{error}</div>}
          <button className="btn btn-primary w-full" type="submit">
            Login
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
