import { API_ENDPOINTS } from "@/utils/constants";
import { apiRequest } from "@/services/api";

export async function getMenu() {
  return apiRequest(API_ENDPOINTS.MENU, { method: "GET" });
}

export async function createFood(payload, token) {
  return apiRequest(API_ENDPOINTS.MENU, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateFood(id, payload, token) {
  return apiRequest(`${API_ENDPOINTS.MENU}/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteFood(id, token) {
  return apiRequest(`${API_ENDPOINTS.MENU}/${id}`, {
    method: "DELETE",
    token,
  });
}
