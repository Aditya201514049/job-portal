"use client";
import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/utils/apiClient";
import Link from "next/link";

const jobTypes = ["Full-time", "Part-time", "Remote"];

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    const query = [];
    if (location) query.push(`location=${encodeURIComponent(location)}`);
    if (jobType) query.push(`jobType=${encodeURIComponent(jobType)}`);
    const q = query.length ? `?${query.join("&")}` : "";
    const { data, ok } = await apiFetch(`/api/jobs${q}`);
    if (ok && Array.isArray(data)) setJobs(data);
    else setError(data?.error || "Failed to load jobs");
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, [location, jobType]);

  const heroStats = useMemo(() => ([
    { label: "Live roles", value: jobs.length },
    { label: "Cities", value: new Set(jobs.map(j => j.location)).size || 12 },
    { label: "Employers", value: new Set(jobs.map(j => j.company)).size || 4 },
  ]), [jobs]);

  return (
    <main className="space-y-8">
      <section className="glass-panel flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="subtle mb-3">Opportunities curated for you</p>
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            Find your next role in a modern job marketplace
          </h1>
          <p className="muted mt-2">
            Search, apply, and track opportunities from curated employers hiring for engineering, design, product, and more.
          </p>
        </div>
        <div className="glass-panel md:w-72 space-y-3">
          {heroStats.map(stat => (
            <div key={stat.label} className="flex justify-between">
              <span className="muted">{stat.label}</span>
              <span className="text-lg font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel space-y-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            className="input"
            placeholder="Filter by location"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <select
            className="input"
            value={jobType}
            onChange={e => setJobType(e.target.value)}
          >
            <option value="">All job types</option>
            {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {jobTypes.map(type => (
            <button
              key={type}
              className={`tag ${jobType === type ? "bg-blue-50 text-blue-700 border-blue-200" : ""}`}
              onClick={() => setJobType(jobType === type ? "" : type)}
            >
              {type}
            </button>
          ))}
          {location && (
            <button
              className="tag bg-red-50 text-red-500 border-red-200"
              onClick={() => setLocation("")}
            >
              Clear location
            </button>
          )}
        </div>
        {loading && <div className="muted">Loading roles...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <div className="card-stack">
          {jobs.map(job => (
            <div key={job._id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="muted">{job.company} • {job.location}</p>
                </div>
                <span className="tag">{job.jobType}</span>
              </div>
              <p className="muted mt-3 text-sm">
                {job.description?.slice(0, 140)}...
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="font-semibold text-lg">{job.salaryRange}</span>
                <Link href={`/jobs/${job._id}`} className="btn btn-primary text-sm">
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
        {!loading && jobs.length === 0 && (
          <div className="card text-center muted">
            No roles match that filter yet. Try adjusting your search.
          </div>
        )}
      </section>
    </main>
  );
}
