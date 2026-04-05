"use client";

import { motion } from "framer-motion";

const SPECIAL_ITEMS = [
  { name: "Rajma Chawal Special", desc: "Slow-cooked kidney beans with fragrant basmati rice", price: 85, emoji: "🍚", tag: "Chef's Pick", calories: 520 },
  { name: "Paneer Tikka Masala", desc: "Grilled cottage cheese in rich tomato-cream gravy", price: 110, emoji: "🧀", tag: "Fan Favorite", calories: 480 },
  { name: "Mango Lassi", desc: "Thick, creamy yoghurt drink with fresh Alphonso mango", price: 55, emoji: "🥭", tag: "Seasonal", calories: 220 },
];

export default function TodaysSpecial() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary-500">✨ Daily Pick</p>
          <h2 className="text-4xl font-black text-dark-900">Today&apos;s Special</h2>
          <p className="mt-2 text-dark-500">Handpicked by our chef — available today only</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {SPECIAL_ITEMS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-dark-100 bg-white p-6 shadow-md hover:shadow-xl hover:shadow-primary-500/10 transition-all"
            >
              {/* Tag */}
              <div className="absolute right-4 top-4">
                <span className="rounded-full bg-primary-500 px-3 py-1 text-xs font-bold text-white">
                  {item.tag}
                </span>
              </div>

              {/* Emoji */}
              <div className="mb-4 text-6xl">{item.emoji}</div>

              {/* Content */}
              <h3 className="mb-2 text-lg font-bold text-dark-900">{item.name}</h3>
              <p className="mb-4 text-sm leading-relaxed text-dark-500">{item.desc}</p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-primary-600">₹{item.price}</p>
                  <p className="text-xs text-dark-400">{item.calories} kcal</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-600">Available</span>
                </div>
              </div>

              {/* Decorative */}
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
