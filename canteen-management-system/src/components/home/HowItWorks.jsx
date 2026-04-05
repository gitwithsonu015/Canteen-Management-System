"use client";

import { motion } from "framer-motion";
import { Search, ShoppingCart, Truck } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Browse Menu",
    desc: "Explore our diverse menu with filters by category, price, and ratings.",
    gradient: "from-primary-400 to-primary-600",
  },
  {
    icon: ShoppingCart,
    step: "02",
    title: "Add to Cart",
    desc: "Choose your favorites, customize quantity, and add them to your cart instantly.",
    gradient: "from-violet-400 to-purple-600",
  },
  {
    icon: Truck,
    step: "03",
    title: "Get It Fresh",
    desc: "We prepare your order fresh. Pick it up at the counter or get it delivered.",
    gradient: "from-emerald-400 to-teal-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-dark-950 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary-400">Simple Process</p>
          <h2 className="text-4xl font-black text-white">How It Works</h2>
          <p className="mt-2 text-white/50">Order in 3 easy steps, no fuss</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, step, title, desc, gradient }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -8 }}
              className="relative text-center"
            >
              {/* Connector line (not on last) */}
              {i < STEPS.length - 1 && (
                <div className="absolute left-full top-10 hidden w-full -translate-x-1/2 border-t-2 border-dashed border-white/10 md:block" />
              )}

              <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-2xl`}>
                <Icon className="h-10 w-10 text-white" />
              </div>
              <div className="mb-2 text-sm font-black text-white/20">{step}</div>
              <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-white/50">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
