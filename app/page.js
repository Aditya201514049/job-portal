"use client";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils/apiClient";

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    let query = [];
    if (location) query.push(`location=${encodeURIComponent(location)}`);
    if (jobType) query.push(`jobType=${encodeURIComponent(jobType)}`);
    const q = query.length ? `?${query.join("&")}` : "";
    const { data, ok } = await apiFetch(`/api/jobs${q}`);
    if (ok && Array.isArray(data)) setJobs(data);
    else setError(data?.error || "Failed to load jobs");
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, [location, jobType]);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-1/2"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <select
          className="border p-2 rounded w-1/2"
          value={jobType}
          onChange={e => setJobType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Remote">Remote</option>
        </select>
      </div>
      {loading && <div>Loading jobs...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <ul className="space-y-4">
        {jobs.map(job => (
          <li key={job._id} className="border rounded p-4">
            <div className="font-semibold text-lg">{job.title}</div>
            <div className="text-gray-700">{job.company} - {job.location}</div>
            <div className="text-gray-500">{job.jobType} | {job.salaryRange}</div>
            <div className="mt-2 text-sm">{job.description?.slice(0, 100)}...</div>
            <a href={`/jobs/${job._id}`} className="text-blue-600 mt-2 inline-block">View Details</a>
          </li>
        ))}
      </ul>
      {!loading && jobs.length === 0 && <div>No jobs found.</div>}
    </main>
  );
}
