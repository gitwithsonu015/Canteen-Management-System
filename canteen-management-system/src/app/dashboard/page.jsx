"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { getOrders } from "@/services/orderService";
import Navbar from "@/components/layout/Navbar";
import OrderCard from "@/components/orders/OrderCard";
import Badge from "@/components/ui/Badge";
import { SkeletonList } from "@/components/ui/SkeletonCard";
import { UtensilsCrossed, ShoppingCart, ClipboardList, Star, TrendingUp, Clock, Flame } from "lucide-react";
import { formatCurrency } from "@/utils/helpers";

const QUICK_LINKS = [
  { href: "/menu", icon: UtensilsCrossed, label: "Browse Menu", desc: "Explore full menu", color: "bg-primary-500", shadow: "shadow-primary-500/30" },
  { href: "/cart", icon: ShoppingCart, label: "My Cart", desc: "View cart items", color: "bg-violet-500", shadow: "shadow-violet-500/30" },
  { href: "/orders", icon: ClipboardList, label: "My Orders", desc: "Track your orders", color: "bg-emerald-500", shadow: "shadow-emerald-500/30" },
];

export default function DashboardPage() {
  const { user, token } = useAuth();
  const { totalItems, totalPrice } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await getOrders(token);
        setOrders((res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchOrders();
  }, [token]);

  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const totalSpent = orders.filter((o) => o.status === "completed").reduce((s, o) => s + (o.totalPrice || 0), 0);
  const activeOrders = orders.filter((o) => o.status === "pending" || o.status === "preparing");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-50">
        {/* Hero banner */}
        <div className="bg-linear-to-r from-dark-950 to-primary-900/30 py-14">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="mb-1 text-sm font-semibold text-primary-400">{greeting} 👋</p>
              <h1 className="text-4xl font-black text-white">{user?.name || "Foodie"}</h1>
              <p className="mt-2 text-white/50">Ready to order something delicious today?</p>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          {/* Stats row */}
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: ClipboardList, label: "Total Orders", value: orders.length, color: "text-primary-500", bg: "bg-primary-50" },
              { icon: Star, label: "Completed", value: completedOrders, color: "text-emerald-600", bg: "bg-emerald-50" },
              { icon: TrendingUp, label: "Total Spent", value: formatCurrency(totalSpent), color: "text-violet-600", bg: "bg-violet-50" },
            ].map(({ icon: Icon, label, value, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md shadow-dark-200/20 border border-dark-100"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div>
                  <p className="text-sm text-dark-500">{label}</p>
                  <p className="text-2xl font-black text-dark-900">{value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active orders */}
              {activeOrders.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <Flame className="h-5 w-5 text-primary-500" />
                    <h2 className="text-xl font-bold text-dark-900">Active Orders</h2>
                    <span className="rounded-full bg-primary-500 px-2 py-0.5 text-xs font-bold text-white">{activeOrders.length}</span>
                  </div>
                  <div className="space-y-4">
                    {activeOrders.map((order) => (
                      <OrderCard key={order._id} order={order} />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent orders */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-dark-500" />
                    <h2 className="text-xl font-bold text-dark-900">Recent Orders</h2>
                  </div>
                  <Link href="/orders" className="text-sm font-bold text-primary-600 hover:text-primary-700">
                    View all
                  </Link>
                </div>
                {loading ? (
                  <SkeletonList count={3} />
                ) : orders.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-dark-200 p-10 text-center">
                    <span className="mb-3 block text-5xl">🍽️</span>
                    <p className="font-semibold text-dark-700">No orders yet</p>
                    <p className="mt-1 text-sm text-dark-400">Start by browsing our menu</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <OrderCard key={order._id} order={order} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick links */}
              <div className="rounded-2xl bg-white p-6 shadow-md border border-dark-100">
                <h3 className="mb-5 text-lg font-bold text-dark-900">Quick Actions</h3>
                <div className="space-y-3">
                  {QUICK_LINKS.map(({ href, icon: Icon, label, desc, color, shadow }) => (
                    <Link key={href} href={href}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-4 rounded-xl p-3 hover:bg-dark-50 transition-colors cursor-pointer"
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} shadow-lg ${shadow}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-dark-900">{label}</p>
                          <p className="text-xs text-dark-400">{desc}</p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Cart summary */}
              {totalItems > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl bg-primary-500 p-6 text-white shadow-xl shadow-primary-500/30"
                >
                  <ShoppingCart className="mb-3 h-8 w-8" />
                  <p className="text-lg font-black">{totalItems} item{totalItems !== 1 ? "s" : ""} in cart</p>
                  <p className="mb-4 text-primary-200">{formatCurrency(totalPrice)}</p>
                  <Link href="/cart">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer">
                      Go to Cart
                    </span>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
