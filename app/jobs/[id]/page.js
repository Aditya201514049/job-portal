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

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!job) return <div className="p-8">Job not found.</div>;

  return (
    <main className="max-w-xl mx-auto p-6 border rounded mt-8">
      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
      <div className="text-gray-700 mb-1">{job.company} - {job.location}</div>
      <div className="text-gray-500 mb-1">{job.jobType} | {job.salaryRange}</div>
      <div className="mb-4 text-sm">{job.description}</div>
      {user && user.role === "jobseeker" && (
        <button className="bg-blue-600 text-white py-2 px-4 rounded" onClick={handleApply}>
          Apply to this job
        </button>
      )}
      {applyMsg && <div className="mt-2 text-green-700">{applyMsg}</div>}
    </main>
  );
}
