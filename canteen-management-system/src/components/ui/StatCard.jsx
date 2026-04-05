"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, trend, trendValue, color = "orange", className = "" }) {
  const colorMap = {
    orange: {
      bg: "bg-primary-50",
      icon: "bg-primary-500",
      text: "text-primary-600",
    },
    blue: {
      bg: "bg-blue-50",
      icon: "bg-blue-500",
      text: "text-blue-600",
    },
    green: {
      bg: "bg-emerald-50",
      icon: "bg-emerald-500",
      text: "text-emerald-600",
    },
    purple: {
      bg: "bg-violet-50",
      icon: "bg-violet-500",
      text: "text-violet-600",
    },
    yellow: {
      bg: "bg-accent-300/20",
      icon: "bg-accent-400",
      text: "text-accent-500",
    },
  };

  const c = colorMap[color] || colorMap.orange;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className={`rounded-2xl bg-white p-6 shadow-md shadow-dark-200/40 border border-dark-100 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-dark-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-dark-900">{value}</p>
          {trendValue && (
            <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
              {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trendValue} vs last week
            </div>
          )}
        </div>
        {Icon && (
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${c.icon} shadow-lg`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
