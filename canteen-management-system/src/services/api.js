const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function apiRequest(endpoint, options = {}) {
  const { token, headers, ...rest } = options;
  const baseUrl = typeof window === "undefined" ? API_BASE_URL : "";

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}