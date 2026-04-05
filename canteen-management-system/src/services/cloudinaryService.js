const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function uploadFoodImage(file, token) {
  const baseUrl = typeof window === "undefined" ? API_BASE_URL : "";
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${baseUrl}/api/upload`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Image upload failed");
  }

  return data.data;
}