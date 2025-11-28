"use client";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils/apiClient";
import { useAuth } from "@/app/providers/AuthProvider";

export default function JobSeekerDashboard() {
  const { user, token } = useAuth() || {};
  const [applied, setApplied] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ bio: "", skills: "", resumeURL: "" });
  const [profileMsg, setProfileMsg] = useState(null);
  const [error, setError] = useState(null);

  // Fetch applied jobs
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    apiFetch("/api/applications", { token })
      .then(({ data, ok }) => {
        if (ok && Array.isArray(data)) setApplied(data);
        else setError(data?.error || "Failed to load applications");
        setLoading(false);
      });
    // Fetch profile
    apiFetch("/api/profile", { token })
      .then(({ data, ok }) => {
        if (ok && data) setProfile({
          bio: data.bio || "",
          skills: data.skills || "",
          resumeURL: data.resumeURL || ""
        });
      });
  }, [token]);

  const handleProfileChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async e => {
    e.preventDefault();
    setProfileMsg(null);
    const { status, data } = await apiFetch("/api/profile", {
      method: "PUT",
      token,
      body: profile,
    });
    if (status === 200) setProfileMsg("Profile updated!");
    else setProfileMsg(data?.error || "Failed to update profile");
  };

  return (
    <main className="space-y-8">
      <section className="glass-panel">
        <h1 className="text-2xl font-bold mb-1">Jobseeker Dashboard</h1>
        <p className="muted">Keep your profile fresh and track every application in one place.</p>
      </section>

      <section className="glass-panel space-y-4">
        <h2 className="section-title">Profile & Resume</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <label className="block text-sm font-medium">
            Bio
            <textarea name="bio" className="input mt-1 h-28 resize-none" value={profile.bio} onChange={handleProfileChange} />
          </label>
          <label className="block text-sm font-medium">
            Skills (comma separated)
            <input name="skills" className="input mt-1" value={profile.skills} onChange={handleProfileChange} />
          </label>
          <label className="block text-sm font-medium">
            Resume URL
            <input name="resumeURL" className="input mt-1" value={profile.resumeURL} onChange={handleProfileChange} />
          </label>
          <button className="btn btn-primary" type="submit">Save profile</button>
          {profileMsg && <div className="text-green-700">{profileMsg}</div>}
        </form>
      </section>

      <section className="glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Applied roles</h2>
          <span className="subtle">{applied.length} submissions</span>
        </div>
        {loading && <div className="muted">Loading applications...</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div className="card-stack">
          {applied.map(app => (
            <div key={app._id} className="card">
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-lg font-semibold">{app.jobId?.title}</h3>
                  <p className="muted text-sm">{app.jobId?.company} • {app.jobId?.location}</p>
                </div>
                <span className="tag">{app.jobId?.jobType}</span>
              </div>
              <p className="muted text-sm mt-3">{app.jobId?.description?.slice(0, 100)}...</p>
              <div className="text-xs muted mt-3">Applied on {new Date(app.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
        {!loading && applied.length === 0 && <div className="muted">You have not applied to any roles yet.</div>}
      </section>
    </main>
  );
}
