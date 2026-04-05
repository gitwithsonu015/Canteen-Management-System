import { API_ENDPOINTS } from "@/utils/constants";
import { apiRequest } from "@/services/api";

export async function getOrders(token) {
  return apiRequest(API_ENDPOINTS.ORDERS, {
    method: "GET",
    token,
  });
}

export async function getOrderById(id, token) {
  return apiRequest(`${API_ENDPOINTS.ORDERS}/${id}`, {
    method: "GET",
    token,
  });
}

export async function createOrder(payload, token) {
  return apiRequest(API_ENDPOINTS.ORDERS, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateOrder(id, payload, token) {
  return apiRequest(`${API_ENDPOINTS.ORDERS}/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}
