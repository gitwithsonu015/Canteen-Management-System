"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { getOrders, updateOrder } from "@/services/orderService";
import { formatCurrency } from "@/utils/helpers";
import { Search, RefreshCw, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_TABS = ["All", "pending", "preparing", "completed", "cancelled"];
const NEXT_STATUS = { pending: "preparing", preparing: "completed" };
const STATUS_ACTIONS = {
  pending: { label: "Start Preparing", color: "bg-blue-500 text-white hover:bg-blue-600" },
  preparing: { label: "Mark Completed", color: "bg-emerald-500 text-white hover:bg-emerald-600" },
};

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await getOrders(token);
      setOrders((response.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token, fetchOrders]);

  async function handleUpdateStatus(orderId, status) {
    setUpdating(orderId);
    try {
      await updateOrder(orderId, { status }, token);
      await fetchOrders();
      toast.success(`Order marked as ${status}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  }

  const filtered = orders
    .filter((o) => tab === "All" || o.status === tab)
    .filter((o) =>
      search === "" ||
      o._id?.includes(search) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase())
    );

  const tabCounts = STATUS_TABS.reduce((acc, s) => {
    acc[s] = s === "All" ? orders.length : orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="flex h-screen overflow-hidden bg-dark-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-dark-100 bg-white px-8 py-4 shadow-sm">
          <div>
            <h1 className="text-xl font-black text-dark-900">Order Management</h1>
            <p className="text-sm text-dark-500">{orders.length} total orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 rounded-xl border-2 border-dark-200 px-4 py-2 text-sm font-semibold text-dark-700 hover:bg-dark-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="p-8">
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {STATUS_TABS.map((s) => (
                <button
                  key={s}
                  onClick={() => setTab(s)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    tab === s ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25" : "bg-white border border-dark-200 text-dark-600 hover:border-primary-300"
                  }`}
                >
                  <span className="capitalize">{s === "All" ? "All" : s}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${tab === s ? "bg-white/20 text-white" : "bg-dark-100 text-dark-600"}`}>
                    {tabCounts[s]}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" />
              <input
                type="text"
                placeholder="Search by ID or customer..."
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
                    {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-dark-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-50">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-6 py-4"><div className="h-4 rounded bg-dark-100" /></td>
                        ))}
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-dark-400">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => {
                      const action = STATUS_ACTIONS[order.status];
                      const isUpdating = updating === order._id;
                      return (
                        <motion.tr
                          key={order._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-dark-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-sm font-bold text-dark-700">#{order._id?.slice(-6)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                                {(order.user?.name || "C").charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-semibold text-dark-800">{order.user?.name || "Customer"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-dark-600">
                            {order.items?.slice(0, 2).map((it, i) => (
                              <span key={i} className="block">{it.name} x{it.quantity}</span>
                            ))}
                            {order.items?.length > 2 && <span className="text-xs text-dark-400">+{order.items.length - 2} more</span>}
                          </td>
                          <td className="px-6 py-4 font-bold text-dark-900">{formatCurrency(order.totalPrice)}</td>
                          <td className="px-6 py-4"><Badge status={order.status} /></td>
                          <td className="px-6 py-4 text-xs text-dark-500">
                            {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {action && (
                                <button
                                  disabled={isUpdating}
                                  onClick={() => handleUpdateStatus(order._id, NEXT_STATUS[order.status])}
                                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-60 ${action.color}`}
                                >
                                  {isUpdating ? "..." : action.label}
                                </button>
                              )}
                              {order.status !== "cancelled" && order.status !== "completed" && (
                                <button
                                  disabled={isUpdating}
                                  onClick={() => handleUpdateStatus(order._id, "cancelled")}
                                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors disabled:opacity-60"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
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

