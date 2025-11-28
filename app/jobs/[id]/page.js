"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/utils/apiClient";
import { useAuth } from "@/app/providers/AuthProvider";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth() || {};
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyMsg, setApplyMsg] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      const { data, ok } = await apiFetch(`/api/jobs?jobId=${params.id}`);
      if (ok && Array.isArray(data) && data.length > 0) setJob(data[0]);
      else if (ok && data && data._id) setJob(data);
      else setError(data?.error || "Job not found");
      setLoading(false);
    };
    fetchJob();
  }, [params.id]);

  const handleApply = async () => {
    setApplyMsg(null);
    if (!user || user.role !== "jobseeker") {
      setApplyMsg("You must be logged in as a jobseeker to apply.");
      return;
    }
    const { status, data } = await apiFetch("/api/applications", {
      method: "POST",
      token,
      body: { jobId: params.id },
    });
    if (status === 201) setApplyMsg("Application submitted!");
    else setApplyMsg(data?.error || "Failed to apply");
  };

  if (loading) return <div className="glass-panel">Loading...</div>;
  if (error) return <div className="glass-panel text-red-600">{error}</div>;
  if (!job) return <div className="glass-panel">Job not found.</div>;

  return (
    <main className="space-y-6">
      <div className="glass-panel space-y-2">
        <p className="subtle w-fit">{job.company}</p>
        <h1 className="text-3xl font-semibold">{job.title}</h1>
        <div className="flex flex-wrap gap-3 muted text-sm">
          <span>{job.location}</span>
          <span className="tag">{job.jobType}</span>
          <span>{job.salaryRange}</span>
        </div>
        <p className="muted mt-4 leading-relaxed">
          {job.description}
        </p>
        {user && user.role === "jobseeker" && (
          <button className="btn btn-primary mt-4" onClick={handleApply}>
            Apply to this job
          </button>
        )}
        {applyMsg && <div className="mt-2 text-green-700">{applyMsg}</div>}
      </div>
    </main>
  );
}
