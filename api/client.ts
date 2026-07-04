const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("jwt");
  const headers = new Headers(options.headers || {});
  
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    window.location.href = "/";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Something went wrong");
  }

  return response.json();
}
