"use client";

import { createContext, useState } from "react";
import { loginUser, registerUser } from "@/services/authService";

export const AuthContext = createContext(null);

function getInitialAuthState() {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }
  const savedToken = localStorage.getItem("cms_token");
  const savedUser = localStorage.getItem("cms_user");
  return {
    token: savedToken || null,
    user: savedUser ? JSON.parse(savedUser) : null,
  };
}

export function AuthProvider({ children }) {
  const initial = getInitialAuthState();
  const [user, setUser] = useState(initial.user);
  const [token, setToken] = useState(initial.token);
  const [loading] = useState(false);

  async function register(payload) {
    const response = await registerUser(payload);
    const authToken = response.data.token;
    const authUser = response.data.user;
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem("cms_token", authToken);
    localStorage.setItem("cms_user", JSON.stringify(authUser));
    return response;
  }

  async function login(payload) {
    const response = await loginUser(payload);
    const authToken = response.data.token;
    const authUser = response.data.user;
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem("cms_token", authToken);
    localStorage.setItem("cms_user", JSON.stringify(authUser));
    return response;
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("cms_token");
    localStorage.removeItem("cms_user");
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === "admin",
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
