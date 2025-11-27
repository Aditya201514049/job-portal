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
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Jobseeker Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Edit Profile</h2>
        <form onSubmit={handleProfileSave} className="space-y-2">
          <label className="block">Bio
            <textarea name="bio" className="w-full border rounded p-2" value={profile.bio} onChange={handleProfileChange} />
          </label>
          <label className="block">Skills (comma separated)
            <input name="skills" className="w-full border rounded p-2" value={profile.skills} onChange={handleProfileChange} />
          </label>
          <label className="block">Resume URL
            <input name="resumeURL" className="w-full border rounded p-2" value={profile.resumeURL} onChange={handleProfileChange} />
          </label>
          <button className="bg-blue-600 text-white py-2 px-4 rounded" type="submit">Save Profile</button>
          {profileMsg && <div className="text-green-700 mt-1">{profileMsg}</div>}
        </form>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Applied Jobs</h2>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        <ul className="space-y-3">
          {applied.map(app => (
            <li key={app._id} className="border rounded p-3">
              <div className="font-semibold">{app.jobId?.title}</div>
              <div className="text-gray-700">{app.jobId?.company} - {app.jobId?.location}</div>
              <div className="text-gray-500">{app.jobId?.jobType} | {app.jobId?.salaryRange}</div>
              <div className="text-sm mt-1">{app.jobId?.description?.slice(0, 80)}...</div>
            </li>
          ))}
        </ul>
        {!loading && applied.length === 0 && <div>No applications yet.</div>}
      </section>
    </main>
  );
}
