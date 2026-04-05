"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getMenu } from "@/services/menuService";

const CATEGORIES = [
  { name: "Starters", emoji: "🥗", gradient: "from-green-400 to-emerald-500", href: "/menu?category=Starters" },
  { name: "Main Course", emoji: "🍛", gradient: "from-primary-400 to-primary-600", href: "/menu?category=Main+Course" },
  { name: "Beverages", emoji: "🧃", gradient: "from-cyan-400 to-blue-500", href: "/menu?category=Beverages" },
  { name: "Desserts", emoji: "🍰", gradient: "from-pink-400 to-rose-500", href: "/menu?category=Desserts" },
  { name: "Snacks", emoji: "🍟", gradient: "from-accent-400 to-orange-500", href: "/menu?category=Snacks" },
  { name: "Breakfast", emoji: "🍳", gradient: "from-amber-400 to-yellow-500", href: "/menu?category=Breakfast" },
];

export default function Categories() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await getMenu();
        setFoods(Array.isArray(response?.data) ? response.data : []);
      } catch {
        setFoods([]);
      }
    }

    fetchMenu();
  }, []);

  const categoryCounts = useMemo(() => {
    return foods.reduce((acc, item) => {
      if (!item?.category) return acc;
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
  }, [foods]);

  return (
    <section className="py-20 bg-dark-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary-500">Explore</p>
          <h2 className="text-4xl font-black text-dark-900">Food Categories</h2>
          <p className="mt-2 text-dark-500">Browse by your favorite food type</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.05 }}
            >
              <Link href={cat.href} className="block">
                <div className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${cat.gradient} p-6 text-center text-white shadow-lg cursor-pointer group`}>
                  <div className="mb-3 text-5xl">{cat.emoji}</div>
                  <h3 className="text-sm font-black">{cat.name}</h3>
                  <p className="mt-0.5 text-xs text-white/70">{categoryCounts[cat.name] || 0} items</p>
                  <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/10" />
                  <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-white/10" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
