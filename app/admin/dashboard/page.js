"use client";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils/apiClient";
import { useAuth } from "@/app/providers/AuthProvider";

export default function AdminDashboard() {
  const { user, token } = useAuth() || {};
  const [pendingEmployers, setPendingEmployers] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      setLoading(true);
      // Fetch pending employers
      const pending = await apiFetch("/api/admin/employers/pending", { token });
      setPendingEmployers(Array.isArray(pending.data) ? pending.data : []);
      // Fetch all users
      const usersRes = await apiFetch("/api/admin/users", { token });
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      // Fetch all jobs
      const jobsRes = await apiFetch("/api/admin/jobs", { token });
      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      // Fetch all applications
      const appsRes = await apiFetch("/api/admin/applications", { token });
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
      setLoading(false);
    };
    fetchData();
  }, [token]);

  if (!user || !token) {
    return <main className="max-w-2xl mx-auto p-4"><div>Loading...</div></main>;
  }

  if (user.role !== "admin") {
    return <main className="max-w-2xl mx-auto p-4"><div>Unauthorized</div></main>;
  }

  const handleApprove = async (employerId) => {
    const res = await apiFetch(`/api/admin/employers/${employerId}?id=${employerId}`, {
      method: "PUT",
      token,
      body: { action: "approve" },
    });
    if (res.status === 200) {
      setMsg("Employer approved.");
      setPendingEmployers(pendingEmployers.filter(e => e._id !== employerId));
    } else {
      setMsg(res.data?.error || "Failed to approve employer");
    }
  };

  const handleReject = async (employerId) => {
    const res = await apiFetch(`/api/admin/employers/${employerId}?id=${employerId}`, {
      method: "PUT",
      token,
      body: { action: "reject" },
    });
    if (res.status === 200) {
      setMsg("Employer rejected.");
      setPendingEmployers(pendingEmployers.filter(e => e._id !== employerId));
    } else {
      setMsg(res.data?.error || "Failed to reject employer");
    }
  };

  return (
    <main className="space-y-8">
      <section className="glass-panel">
        <h1 className="text-2xl font-bold">Admin Command Center</h1>
        <p className="muted">Approve employers, watch platform health, and keep the marketplace safe.</p>
        {msg && <div className="subtle mt-3">{msg}</div>}
      </section>
      {loading && <div className="glass-panel muted">Loading insights...</div>}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="glass-panel">
          <h2 className="section-title">Pending employers</h2>
          <div className="space-y-3">
            {pendingEmployers.length === 0 && <p className="muted">No pending requests.</p>}
            {pendingEmployers.map(emp => (
              <div key={emp._id} className="card space-y-2">
                <div className="font-semibold">{emp.name}</div>
                <div className="muted text-sm">{emp.email}</div>
                <div className="flex gap-2">
                  <button className="btn btn-primary text-sm" onClick={() => handleApprove(emp._id)}>Approve</button>
                  <button className="btn btn-ghost text-sm" onClick={() => handleReject(emp._id)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel">
          <h2 className="section-title">Platform snapshot</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Users", value: users.length },
              { label: "Jobs", value: jobs.length },
              { label: "Applications", value: applications.length },
              { label: "Employers pending", value: pendingEmployers.length },
            ].map(stat => (
              <div key={stat.label} className="card">
                <div className="muted text-sm">{stat.label}</div>
                <div className="text-2xl font-semibold">
                  {loading ? <span className="opacity-60">...</span> : stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel space-y-3">
        <h2 className="section-title">All users</h2>
        <div className="card-stack">
          {users.map(u => (
            <div key={u._id} className="card flex items-center justify-between">
              <div>
                <div className="font-semibold">{u.name}</div>
                <div className="muted text-sm">{u.email}</div>
              </div>
              <span className="tag">{u.role}{u.isBlocked ? " • blocked" : ""}</span>
            </div>
          ))}
          {users.length === 0 && <p className="muted">No users yet.</p>}
        </div>
      </section>

      <section className="glass-panel space-y-3">
        <h2 className="section-title">Jobs overview</h2>
        <div className="card-stack">
          {jobs.map(job => (
            <div key={job._id} className="card flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="font-semibold">{job.title}</div>
                <div className="muted text-sm">{job.company} • {job.location}</div>
              </div>
              <span className="tag">{job.jobType}</span>
            </div>
          ))}
          {jobs.length === 0 && <p className="muted">No jobs yet.</p>}
        </div>
      </section>

      <section className="glass-panel space-y-3">
        <h2 className="section-title">Recent applications</h2>
        <div className="card-stack">
          {applications.map(app => (
            <div key={app._id} className="card">
              <div className="font-semibold">{app.jobId?.title}</div>
              <p className="muted text-sm">Applicant: {app.jobSeekerId?.name} ({app.jobSeekerId?.email})</p>
            </div>
          ))}
          {applications.length === 0 && <p className="muted">No applications submitted yet.</p>}
        </div>
      </section>
    </main>
  );
}
