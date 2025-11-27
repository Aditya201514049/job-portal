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
    <form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded mb-4">
      <input name="title" className="w-full border p-2 rounded" placeholder="Title" value={form.title} onChange={handleChange} />
      <input name="company" className="w-full border p-2 rounded" placeholder="Company" value={form.company} onChange={handleChange} />
      <input name="location" className="w-full border p-2 rounded" placeholder="Location" value={form.location} onChange={handleChange} />
      <select name="jobType" className="w-full border p-2 rounded" value={form.jobType} onChange={handleChange}>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Remote">Remote</option>
      </select>
      <input name="salaryRange" className="w-full border p-2 rounded" placeholder="Salary Range" value={form.salaryRange} onChange={handleChange} />
      <textarea name="description" className="w-full border p-2 rounded" placeholder="Description" value={form.description} onChange={handleChange} />
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex gap-2">
        <button className="bg-blue-600 text-white py-1 px-4 rounded" type="submit">Save</button>
        {onCancel && <button className="bg-gray-300 py-1 px-4 rounded" type="button" onClick={onCancel}>Cancel</button>}
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
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employer Dashboard</h1>
      <button className="bg-green-600 text-white py-2 px-4 rounded mb-4" onClick={() => { setShowForm(!showForm); setEditing(null); }}>
        {showForm ? "Hide" : "Create New Job"}
      </button>
      {showForm && <JobForm onSave={handleCreate} onCancel={() => setShowForm(false)} />}
      {editing && <JobForm initial={editing} onSave={handleEdit} onCancel={() => setEditing(null)} />}
      {msg && <div className="text-green-700 mb-2">{msg}</div>}
      {loading && <div>Loading jobs...</div>}
      <ul className="space-y-4">
        {jobs.map(job => (
          <li key={job._id} className="border rounded p-4">
            <div className="font-semibold text-lg">{job.title}</div>
            <div className="text-gray-700">{job.company} - {job.location}</div>
            <div className="text-gray-500">{job.jobType} | {job.salaryRange}</div>
            <div className="mt-2 text-sm">{job.description?.slice(0, 100)}...</div>
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setEditing(job)}>Edit</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(job)}>Delete</button>
              <button className="bg-gray-600 text-white px-3 py-1 rounded" onClick={() => handleViewApplicants(job)}>View Applicants</button>
            </div>
            {applicants[job._id] && (
              <div className="mt-2 border-t pt-2">
                <div className="font-semibold mb-1">Applicants:</div>
                <ul className="space-y-1">
                  {applicants[job._id].length === 0 && <li>No applicants yet.</li>}
                  {applicants[job._id].map(app => (
                    <li key={app._id} className="text-sm">
                      {app.jobSeekerId?.name} ({app.jobSeekerId?.email})<br />
                      Skills: {app.jobSeekerId?.skills}<br />
                      {app.jobSeekerId?.resumeURL && <a href={app.jobSeekerId.resumeURL} className="text-blue-600" target="_blank">Resume</a>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
      {!loading && jobs.length === 0 && <div>No jobs posted yet.</div>}
    </main>
  );
}
