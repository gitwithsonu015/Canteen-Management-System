"use client";

import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/helpers";
import Badge from "@/components/ui/Badge";
import { Clock, Package, ChevronRight } from "lucide-react";

export default function OrderCard({ order, adminMode = false, onUpdateStatus }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-dark-100 bg-white p-5 shadow-md shadow-dark-200/20 hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
            <Package className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-dark-900">Order #{order._id?.slice(-6)}</p>
            <div className="flex items-center gap-1 text-xs text-dark-500">
              <Clock className="h-3 w-3" />
              {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
        <Badge status={order.status} />
      </div>

      {/* Items */}
      <div className="mb-4 space-y-2">
        {order.items?.slice(0, 3).map((item, idx) => (
          <div key={`${order._id}-${idx}`} className="flex items-center justify-between text-sm">
            <span className="text-dark-700">{item.name}</span>
            <span className="font-semibold text-dark-500">x{item.quantity}</span>
          </div>
        ))}
        {order.items?.length > 3 && (
          <p className="text-xs text-dark-400">+{order.items.length - 3} more items</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-dark-100 pt-3">
        <div>
          <p className="text-xs text-dark-500">Total Amount</p>
          <p className="text-lg font-black text-dark-900">{formatCurrency(order.totalPrice)}</p>
        </div>

        {adminMode && (
          <div className="flex gap-2">
            {order.status === "pending" && (
              <button
                onClick={() => onUpdateStatus?.(order._id, "preparing")}
                className="rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Start Preparing
              </button>
            )}
            {order.status === "preparing" && (
              <button
                onClick={() => onUpdateStatus?.(order._id, "completed")}
                className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                Mark Done
              </button>
            )}
            {order.status !== "cancelled" && order.status !== "completed" && (
              <button
                onClick={() => onUpdateStatus?.(order._id, "cancelled")}
                className="rounded-xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
