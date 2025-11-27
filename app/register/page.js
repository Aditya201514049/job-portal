"use client";
import React, { useState } from "react";
import { apiFetch } from "@/lib/utils/apiClient";
import { useAuth } from "@/app/providers/AuthProvider";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("jobseeker");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { signIn } = useAuth();

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
      signIn({ token: data.token, user: data.user });
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => (window.location.href = "/"), 1000);
      return;
    }
    setError(data?.error || "Registration failed");
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Name
          <input className="w-full p-2 border rounded" value={name} onChange={e=>setName(e.target.value)} />
        </label>
        <label className="block mb-2">Email
          <input className="w-full p-2 border rounded" value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <label className="block mb-2">Password
          <input type="password" className="w-full p-2 border rounded" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        <label className="block mb-2">Role
          <select className="w-full p-2 border rounded" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="jobseeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </label>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <button className="bg-blue-600 text-white py-2 px-4 rounded" type="submit">Register</button>
      </form>
    </div>
  );
}