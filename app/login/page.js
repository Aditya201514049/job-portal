"use client";
import React, { useState } from "react";
import { apiFetch } from "@/lib/utils/apiClient";
import { useAuth } from "@/app/providers/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const { status, data } = await apiFetch("/api/auth/login", { method: "POST", body: { email, password } });
    if (status === 200 && data?.token) {
      signIn({ token: data.token, user: data.user });
      // redirect to home
      window.location.href = "/";
      return;
    }
    setError(data?.error || "Login failed");
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Email
          <input className="w-full p-2 border rounded" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </label>
        <label className="block mb-2">Password
          <input type="password" className="w-full p-2 border rounded" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </label>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button className="bg-blue-600 text-white py-2 px-4 rounded" type="submit">Login</button>
      </form>
    </div>
  );
}
