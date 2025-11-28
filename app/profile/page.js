"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { apiFetch } from "@/lib/utils/apiClient";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { token, user } = useAuth() || {};
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    const fetchProfile = async () => {
      setLoading(true);
      const { ok, data } = await apiFetch("/api/profile", { token });
      if (ok) setProfile(data);
      else setError(data?.error || "Unable to load profile");
      setLoading(false);
    };
    fetchProfile();
  }, [token, router]);

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setMessage(null);
    const body = {
      bio: profile?.bio || "",
      skills: profile?.skills || "",
      resumeURL: profile?.resumeURL || "",
    };
    const { status, data } = await apiFetch("/api/profile", {
      method: "PUT",
      token,
      body,
    });
    if (status === 200) setMessage("Profile updated successfully.");
    else setMessage(data?.error || "Failed to update profile.");
    setSaving(false);
  };

  if (!user || !token) {
    return <main className="max-w-2xl mx-auto p-4">Redirecting...</main>;
  }

  if (loading) {
    return <main className="max-w-2xl mx-auto p-4">Loading profile...</main>;
  }

  if (error) {
    return <main className="max-w-2xl mx-auto p-4 text-red-600">{error}</main>;
  }

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <section className="border rounded p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="space-y-2 text-sm">
          <div><span className="font-semibold">Name:</span> {profile?.name}</div>
          <div><span className="font-semibold">Email:</span> {profile?.email}</div>
          <div><span className="font-semibold">Role:</span> {profile?.role}</div>
          {profile?.role === "employer" && (
            <div><span className="font-semibold">Approval:</span> {profile?.isApproved ? "Approved" : "Pending"}</div>
          )}
          <div><span className="font-semibold">Status:</span> {profile?.isBlocked ? "Blocked" : "Active"}</div>
        </div>
      </section>

      {profile?.role === "jobseeker" && (
        <section className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-3">Jobseeker Details</h2>
          <form onSubmit={handleSave} className="space-y-3">
            <label className="block text-sm">
              Bio
              <textarea
                name="bio"
                className="w-full border rounded p-2 mt-1"
                value={profile?.bio || ""}
                onChange={handleChange}
              />
            </label>
            <label className="block text-sm">
              Skills (comma separated)
              <input
                name="skills"
                className="w-full border rounded p-2 mt-1"
                value={profile?.skills || ""}
                onChange={handleChange}
              />
            </label>
            <label className="block text-sm">
              Resume URL
              <input
                name="resumeURL"
                className="w-full border rounded p-2 mt-1"
                value={profile?.resumeURL || ""}
                onChange={handleChange}
              />
            </label>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {message && <div className="text-green-700">{message}</div>}
          </form>
        </section>
      )}
    </main>
  );
}

