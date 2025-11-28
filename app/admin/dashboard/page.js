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

  // Guard: Only allow admin
  if (!user || !token) return <main className="max-w-2xl mx-auto p-4"><div>Loading...</div></main>;
  if (user.role !== "admin") return <main className="max-w-2xl mx-auto p-4"><div>Unauthorized</div></main>;

  useEffect(() => {
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
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {msg && <div className="text-green-700 mb-2">{msg}</div>}
      {loading && <div>Loading data...</div>}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pending Employers</h2>
        <ul className="space-y-2">
          {pendingEmployers.length === 0 && <li>No pending employers.</li>}
          {pendingEmployers.map(emp => (
            <li key={emp._id} className="border rounded p-2 flex justify-between items-center">
              <span>{emp.name} ({emp.email})</span>
              <div className="flex gap-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleApprove(emp._id)}>Approve</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleReject(emp._id)}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">All Users</h2>
        <ul className="space-y-1">
          {users.length === 0 && <li>No users found.</li>}
          {users.map(u => (
            <li key={u._id}>{u.name} ({u.email}) - {u.role} {u.isBlocked ? "[Blocked]" : ""}</li>
          ))}
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">All Jobs</h2>
        <ul className="space-y-1">
          {jobs.length === 0 && <li>No jobs found.</li>}
          {jobs.map(j => (
            <li key={j._id}>{j.title} at {j.company} ({j.location})</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">All Applications</h2>
        <ul className="space-y-1">
          {applications.length === 0 && <li>No applications found.</li>}
          {applications.map(a => (
            <li key={a._id}>Job: {a.jobId?.title} | Applicant: {a.jobSeekerId?.name} ({a.jobSeekerId?.email})</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
