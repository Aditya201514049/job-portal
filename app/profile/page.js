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
    return <main className="glass-panel">Redirecting...</main>;
  }

  if (loading) {
    return <main className="glass-panel">Loading profile...</main>;
  }

  if (error) {
    return <main className="glass-panel text-red-600">{error}</main>;
  }

  return (
    <main className="space-y-6">
      <section className="glass-panel space-y-2">
        <p className="subtle w-fit">Account overview</p>
        <h1 className="text-3xl font-semibold">{profile?.name}</h1>
        <div className="muted">{profile?.email}</div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="tag">{profile?.role}</span>
          {profile?.role === "employer" && (
            <span className="tag">
              {profile?.isApproved ? "Approved" : "Pending approval"}
            </span>
          )}
          {profile?.isBlocked && <span className="tag">Blocked</span>}
        </div>
      </section>

      {profile?.role === "jobseeker" && (
        <section className="glass-panel space-y-4">
          <h2 className="section-title">Jobseeker details</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <label className="block text-sm font-medium">
              Bio
              <textarea
                name="bio"
                className="input mt-1 h-28 resize-none"
                value={profile?.bio || ""}
                onChange={handleChange}
              />
            </label>
            <label className="block text-sm font-medium">
              Skills (comma separated)
              <input
                name="skills"
                className="input mt-1"
                value={profile?.skills || ""}
                onChange={handleChange}
              />
            </label>
            <label className="block text-sm font-medium">
              Resume URL
              <input
                name="resumeURL"
                className="input mt-1"
                value={profile?.resumeURL || ""}
                onChange={handleChange}
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {message && <div className="text-green-700">{message}</div>}
          </form>
        </section>
      )}
    </main>
  );
}

