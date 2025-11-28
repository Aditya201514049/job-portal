"use client";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils/apiClient";
import { useAuth } from "@/app/providers/AuthProvider";

function JobForm({ onSave, initial = {}, onCancel }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    company: initial.company || "",
    location: initial.location || "",
    jobType: initial.jobType || "Full-time",
    salaryRange: initial.salaryRange || "",
    description: initial.description || "",
  });
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location || !form.jobType || !form.salaryRange || !form.description) {
      setError("All fields are required");
      return;
    }
    setError(null);
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel space-y-3">
      <input name="title" className="input" placeholder="Role title" value={form.title} onChange={handleChange} />
      <input name="company" className="input" placeholder="Company" value={form.company} onChange={handleChange} />
      <input name="location" className="input" placeholder="Location" value={form.location} onChange={handleChange} />
      <select name="jobType" className="input" value={form.jobType} onChange={handleChange}>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Remote">Remote</option>
      </select>
      <input name="salaryRange" className="input" placeholder="Salary range" value={form.salaryRange} onChange={handleChange} />
      <textarea name="description" className="input" placeholder="Role description" value={form.description} onChange={handleChange} />
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex gap-2">
        <button className="btn btn-primary" type="submit">Save</button>
        {onCancel && <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default function EmployerDashboard() {
  const { user, token } = useAuth() || {};
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState(null);
  const [applicants, setApplicants] = useState({});

  // Guard: Wait for user and token to load
  if (!user || !token) {
    return <main className="max-w-2xl mx-auto p-4"><div>Loading...</div></main>;
  }

  const fetchJobs = async () => {
    setLoading(true);
    const { data, ok } = await apiFetch("/api/employer/jobs", { token });
    if (ok && Array.isArray(data)) setJobs(data);
    setLoading(false);
  };

  useEffect(() => { if (token) fetchJobs(); }, [token]);

  const handleCreate = async (form) => {
    const { status, data } = await apiFetch("/api/jobs", { method: "POST", token, body: form });
    if (status === 201) {
      setMsg("Job created!");
      setShowForm(false);
      fetchJobs();
    } else setMsg(data?.error || "Failed to create job");
  };

  const handleEdit = async (form) => {
    const { status, data } = await apiFetch(`/api/jobs/${editing._id}?id=${editing._id}`, { method: "PUT", token, body: form });
    if (status === 200) {
      setMsg("Job updated!");
      setEditing(null);
      fetchJobs();
    } else setMsg(data?.error || "Failed to update job");
  };

  const handleDelete = async (job) => {
    if (!window.confirm("Delete this job?")) return;
    const { status, data } = await apiFetch(`/api/jobs/${job._id}?id=${job._id}`, { method: "DELETE", token });
    if (status === 200) {
      setMsg("Job deleted.");
      fetchJobs();
    } else setMsg(data?.error || "Failed to delete job");
  };

  const handleViewApplicants = async (job) => {
    const { data, ok } = await apiFetch(`/api/employer/applicants?jobId=${job._id}`, { token });
    if (ok && Array.isArray(data)) setApplicants(a => ({ ...a, [job._id]: data }));
    else setApplicants(a => ({ ...a, [job._id]: [] }));
  };

  return (
    <main className="space-y-8">
      <section className="glass-panel flex flex-col gap-3">
        <h1 className="text-2xl font-bold">Employer Workspace</h1>
        <p className="muted">Create openings, manage applicants, and keep your listings up to date.</p>
        <div className="flex gap-3 flex-wrap">
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); }}>
            {showForm ? "Close form" : "Create new job"}
          </button>
          {msg && <span className="subtle">{msg}</span>}
        </div>
      </section>
      {showForm && <JobForm onSave={handleCreate} onCancel={() => setShowForm(false)} />}
      {editing && (
        <div className="glass-panel">
          <h2 className="section-title">Editing {editing.title}</h2>
          <JobForm initial={editing} onSave={handleEdit} onCancel={() => setEditing(null)} />
        </div>
      )}
      <section className="glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Active postings</h2>
          <span className="subtle">{jobs.length} live</span>
        </div>
        {loading && <div className="muted">Loading jobs...</div>}
        <div className="card-stack">
          {jobs.map(job => (
            <div key={job._id} className="card space-y-3">
              <div className="flex justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="muted text-sm">{job.company} • {job.location}</p>
                </div>
                <span className="tag">{job.jobType}</span>
              </div>
              <p className="muted text-sm">{job.description?.slice(0, 120)}...</p>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-ghost text-sm" onClick={() => setEditing(job)}>Edit</button>
                <button className="btn btn-ghost text-sm" onClick={() => handleDelete(job)}>Delete</button>
                <button className="btn btn-primary text-sm" onClick={() => handleViewApplicants(job)}>View applicants</button>
              </div>
              {applicants[job._id] && (
                <div className="glass-panel bg-[#f8faff]">
                  <div className="font-semibold mb-2">Applicants</div>
                  <ul className="space-y-2">
                    {applicants[job._id].length === 0 && <li className="muted text-sm">No applicants yet.</li>}
                    {applicants[job._id].map(app => (
                      <li key={app._id} className="text-sm">
                        <div className="font-medium">{app.jobSeekerId?.name}</div>
                        <div className="muted text-xs">{app.jobSeekerId?.email}</div>
                        <div className="muted text-xs">Skills: {app.jobSeekerId?.skills || "N/A"}</div>
                        {app.jobSeekerId?.resumeURL && (
                          <a href={app.jobSeekerId.resumeURL} target="_blank" className="text-blue-600 text-xs" rel="noreferrer">
                            View resume
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
        {!loading && jobs.length === 0 && <div className="muted">No postings yet. Create your first role to see it here.</div>}
      </section>
    </main>
  );
}
