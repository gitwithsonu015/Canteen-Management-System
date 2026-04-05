"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { getOrders } from "@/services/orderService";
import OrderCard from "@/components/orders/OrderCard";
import Navbar from "@/components/layout/Navbar";
import { SkeletonList } from "@/components/ui/SkeletonCard";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { ClipboardList, ShoppingCart } from "lucide-react";

const STATUS_FILTERS = ["All", "pending", "preparing", "completed", "cancelled"];

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await getOrders(token);
        setOrders((response.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchOrders();
  }, [token]);

  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-50">
        {/* Header */}
        <div className="bg-dark-950 py-12">
          <div className="mx-auto max-w-5xl px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/20">
                  <ClipboardList className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white">My Orders</h1>
                  <p className="text-white/50">{orders.length} total orders</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
          {/* Filter tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  filter === s
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                    : "bg-white text-dark-600 border border-dark-200 hover:border-primary-300"
                }`}
              >
                {s === "All" ? "All Orders" : <><span className="capitalize">{s}</span></>}
              </button>
            ))}
          </div>

          {loading ? (
            <SkeletonList count={4} />
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-3xl bg-white py-20 text-center border border-dark-100"
            >
              <span className="mb-4 text-7xl">📋</span>
              <h3 className="mb-2 text-xl font-bold text-dark-800">
                {filter === "All" ? "No orders yet" : `No ${filter} orders`}
              </h3>
              <p className="mb-6 text-dark-500">Place your first order and track it here in real-time</p>
              <Link href="/menu">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors cursor-pointer">
                  <ShoppingCart className="h-4 w-4" />
                  Browse Menu
                </span>
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
