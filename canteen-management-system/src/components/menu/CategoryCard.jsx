"use client";

import { motion } from "framer-motion";

const CATEGORY_CONFIG = {
  "Starters": { emoji: "🥗", gradient: "from-green-400 to-emerald-500", bg: "bg-green-50" },
  "Main Course": { emoji: "🍛", gradient: "from-primary-400 to-primary-600", bg: "bg-primary-50" },
  "Beverages": { emoji: "🧃", gradient: "from-cyan-400 to-blue-500", bg: "bg-cyan-50" },
  "Desserts": { emoji: "🍰", gradient: "from-pink-400 to-rose-500", bg: "bg-pink-50" },
  "Snacks": { emoji: "🍟", gradient: "from-accent-400 to-orange-500", bg: "bg-accent-300/20" },
  "Breakfast": { emoji: "🍳", gradient: "from-amber-400 to-yellow-500", bg: "bg-amber-50" },
  "All": { emoji: "🍽️", gradient: "from-violet-400 to-purple-600", bg: "bg-violet-50" },
};

export default function CategoryCard({ category, selected, onClick }) {
  const config = CATEGORY_CONFIG[category] || { emoji: "🍴", gradient: "from-dark-400 to-dark-600", bg: "bg-dark-50" };

  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-2xl px-5 py-4 transition-all duration-200 min-w-[90px] ${
        selected
          ? `bg-gradient-to-br ${config.gradient} text-white shadow-xl`
          : "bg-white border-2 border-dark-100 text-dark-700 hover:border-primary-200 hover:shadow-md"
      }`}
    >
      <span className="text-3xl">{config.emoji}</span>
      <span className="whitespace-nowrap text-xs font-bold">{category}</span>
    </motion.button>
  );
}
