import { API_ENDPOINTS } from "@/utils/constants";
import { apiRequest } from "@/services/api";

export async function registerUser(payload) {
  return apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  return apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
