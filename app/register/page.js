"use client";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils/apiClient";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("jobseeker");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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
    setSuccess(null);
    if (!name || !email || !password || !role) {
      setError("All fields are required");
      return;
    }
    const { status, data } = await apiFetch("/api/auth/register", {
      method: "POST",
      body: { name, email, password, role },
    });
    if (status === 201 && data?.token) {
      signIn?.({ token: data.token, user: data.user });
      setSuccess("Registration successful! Redirecting...");
      router.replace("/");
      return;
    }
    setError(data?.error || "Registration failed");
  };

  if (user) {
    return <div className="glass-panel max-w-md mx-auto mt-10">Redirecting...</div>;
  }

  return (
    <main className="flex items-center justify-center">
      <div className="glass-panel w-full max-w-lg space-y-5">
        <div>
          <p className="subtle">Create an account</p>
          <h1 className="text-2xl font-semibold">Join the Job Portal</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium">
            Name
            <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block text-sm font-medium">
            Email
            <input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
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
          <label className="block text-sm font-medium">
            Role
            <select className="input mt-1" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </label>
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
          <button className="btn btn-primary w-full" type="submit">
            Register
          </button>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;

