"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import { SkeletonStatCard } from "@/components/ui/SkeletonCard";
import { getOrders } from "@/services/orderService";
import { getMenu } from "@/services/menuService";
import { formatCurrency } from "@/utils/helpers";
import {
  ShoppingBag, DollarSign, UtensilsCrossed, Users, Clock,
  TrendingUp, ArrowRight, CheckCircle, AlertCircle
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [menuCount, setMenuCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, menuRes] = await Promise.all([getOrders(token), getMenu()]);
      setOrders(ordersRes.data || []);
      setMenuCount((menuRes.data || []).length);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const totalRevenue = orders.filter((o) => o.status === "completed").reduce((s, o) => s + (o.totalPrice || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

  const stats = [
    { title: "Total Orders", value: orders.length, icon: ShoppingBag, color: "orange", trend: "up", trendValue: "+12%" },
    { title: "Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "green", trend: "up", trendValue: "+8%" },
    { title: "Menu Items", value: menuCount, icon: UtensilsCrossed, color: "blue" },
    { title: "Today's Orders", value: todayOrders.length, icon: Clock, color: "purple", trend: "up", trendValue: "+3 today" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-dark-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-dark-100 bg-white px-8 py-4 shadow-sm">
          <div>
            <h1 className="text-xl font-black text-dark-900">Dashboard</h1>
            <p className="text-sm text-dark-500">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            {pendingOrders.length > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-700">{pendingOrders.length} pending</span>
              </div>
            )}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl bg-linear-to-r from-dark-950 to-primary-900/30 p-8 text-white"
          >
            <p className="text-primary-400 font-semibold mb-1">Welcome back 👋</p>
            <h2 className="text-3xl font-black">{user?.name || "Admin"}</h2>
            <p className="mt-1 text-white/50">Here&apos;s what&apos;s happening in your canteen today.</p>
          </motion.div>

          {/* Stats */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
              : stats.map((s, i) => (
                  <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <StatCard {...s} />
                  </motion.div>
                ))}
          </div>

          <div className="grid gap-8 xl:grid-cols-3">
            {/* Recent orders table */}
            <div className="xl:col-span-2">
              <div className="rounded-2xl bg-white shadow-md border border-dark-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-dark-100">
                  <h3 className="text-lg font-bold text-dark-900">Recent Orders</h3>
                  <Link href="/admin/orders" className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700">
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-dark-50">
                      <tr>
                        {["Order ID", "Customer", "Items", "Total", "Status"].map((h) => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-dark-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-50">
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <td key={j} className="px-6 py-4"><div className="h-4 rounded bg-dark-100" /></td>
                            ))}
                          </tr>
                        ))
                      ) : recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-10 text-center text-dark-400">No orders yet</td>
                        </tr>
                      ) : (
                        recentOrders.map((order) => (
                          <tr key={order._id} className="hover:bg-dark-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-mono font-semibold text-dark-700">#{order._id?.slice(-6)}</td>
                            <td className="px-6 py-4 text-sm text-dark-700">{order.user?.name || "Customer"}</td>
                            <td className="px-6 py-4 text-sm text-dark-500">{order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}</td>
                            <td className="px-6 py-4 text-sm font-bold text-dark-900">{formatCurrency(order.totalPrice)}</td>
                            <td className="px-6 py-4"><Badge status={order.status} /></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="space-y-5">
              <div className="rounded-2xl bg-white p-6 shadow-md border border-dark-100">
                <h3 className="mb-5 text-lg font-bold text-dark-900">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { href: "/admin/menu", icon: UtensilsCrossed, label: "Manage Menu", color: "bg-primary-500", shadow: "shadow-primary-500/25" },
                    { href: "/admin/orders", icon: ShoppingBag, label: "View Orders", color: "bg-violet-500", shadow: "shadow-violet-500/25" },
                  ].map(({ href, icon: Icon, label, color, shadow }) => (
                    <Link key={href} href={href}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-4 rounded-xl p-3 hover:bg-dark-50 transition-colors cursor-pointer"
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} shadow-lg ${shadow}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold text-dark-800">{label}</span>
                        <ArrowRight className="ml-auto h-4 w-4 text-dark-400" />
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Order status breakdown */}
              <div className="rounded-2xl bg-white p-6 shadow-md border border-dark-100">
                <h3 className="mb-5 text-lg font-bold text-dark-900">Order Status</h3>
                {[
                  { status: "pending", label: "Pending", count: orders.filter((o) => o.status === "pending").length, color: "bg-amber-500" },
                  { status: "preparing", label: "Preparing", count: orders.filter((o) => o.status === "preparing").length, color: "bg-blue-500" },
                  { status: "completed", label: "Completed", count: orders.filter((o) => o.status === "completed").length, color: "bg-emerald-500" },
                  { status: "cancelled", label: "Cancelled", count: orders.filter((o) => o.status === "cancelled").length, color: "bg-red-500" },
                ].map(({ label, count, color }) => (
                  <div key={label} className="mb-4">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-semibold text-dark-700">{label}</span>
                      <span className="font-bold text-dark-900">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-dark-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color} transition-all duration-700`}
                        style={{ width: orders.length > 0 ? `${(count / orders.length) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
