export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
  },
  MENU: "/api/menu",
  ORDERS: "/api/orders",
};

export const ORDER_STATUS = ["pending", "preparing", "completed", "cancelled"];

export const PAYMENT_STATUS = ["unpaid", "paid"];

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};