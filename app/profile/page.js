"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { apiFetch } from "@/lib/utils/apiClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { token, user } = useAuth() || {};
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <div className="flex items-center justify-between">
            <h2 className="section-title">Jobseeker details</h2>
            <Link href="/jobseeker/dashboard" className="btn btn-ghost text-sm">
              Edit profile
            </Link>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Bio</label>
              <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200 min-h-[80px]">
                {profile?.bio ? (
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{profile.bio}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic">No bio added yet</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Skills</label>
              <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
                {profile?.skills ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.split(",").map((skill, idx) => (
                      <span key={idx} className="tag bg-blue-50 text-blue-700 border-blue-200">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No skills added yet</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Resume URL</label>
              <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
                {profile?.resumeURL ? (
                  <a 
                    href={profile.resumeURL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {profile.resumeURL}
                  </a>
                ) : (
                  <p className="text-sm text-gray-400 italic">No resume URL added yet</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

