"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { Search, Users, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.data || data.users || []);
    } catch (err) {
      toast.error(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, fetchUsers]);

  const filtered = users.filter(
    (u) =>
      search === "" ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-dark-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-dark-100 bg-white px-8 py-4 shadow-sm">
          <div>
            <h1 className="text-xl font-black text-dark-900">User Management</h1>
            <p className="text-sm text-dark-500">{users.length} registered users</p>
          </div>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 rounded-xl border-2 border-dark-200 px-4 py-2 text-sm font-semibold text-dark-700 hover:bg-dark-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="p-8">
          {/* Search */}
          <div className="mb-6 flex items-center justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border-2 border-dark-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary-400 transition-colors"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-white shadow-md border border-dark-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-50">
                  <tr>
                    {["User", "Email", "Role", "Joined", "Status"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-dark-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-50">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="px-6 py-4"><div className="h-4 rounded bg-dark-100" /></td>
                        ))}
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <Users className="mx-auto mb-3 h-12 w-12 text-dark-200" />
                        <p className="text-dark-400 font-medium">No users found</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((user) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-dark-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                              {(user.name || "U").charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-dark-800">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-dark-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-dark-100 text-dark-600"}`}>
                            {user.role || "user"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-dark-500">
                          {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="px-6 py-4">
                          <Badge status="available" />
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
