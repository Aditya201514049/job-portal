"use strict";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

export async function apiFetch(path, { method = "GET", body, token, headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { status: res.status, ok: res.ok, data };
}

export function saveAuth(token, user) {
  if (typeof window === "undefined") return;
  localStorage.setItem("jp_token", token);
  localStorage.setItem("jp_user", JSON.stringify(user));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("jp_token");
  localStorage.removeItem("jp_user");
}

export function loadAuth() {
  if (typeof window === "undefined") return { token: null, user: null };
  const token = localStorage.getItem("jp_token");
  const user = localStorage.getItem("jp_user");
  return { token: token || null, user: user ? JSON.parse(user) : null };
}

export default apiFetch;
