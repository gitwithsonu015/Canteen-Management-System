"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, Truck } from "lucide-react";

const stats = [
  { icon: Star, value: "4.9", label: "Rating" },
  { icon: Clock, value: "15 min", label: "Avg Delivery" },
  { icon: Truck, value: "500+", label: "Daily Orders" },
];

const floatingFoods = [
  { emoji: "🍔", className: "top-16 right-12 lg:right-24", delay: 0 },
  { emoji: "🍕", className: "top-32 right-8 lg:right-16", delay: 0.3 },
  { emoji: "🍜", className: "bottom-32 right-20 lg:right-32", delay: 0.6 },
  { emoji: "🧃", className: "bottom-16 right-6 lg:right-12", delay: 0.2 },
  { emoji: "🍛", className: "top-20 right-40 lg:right-56", delay: 0.5 },
  { emoji: "🍰", className: "bottom-44 right-8 lg:right-16", delay: 0.8 },
];

export default function HeroSection() {
  return (
    <section className="hero-gradient relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-accent-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-primary-600/10 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
                <span className="text-sm font-semibold text-primary-300">Now Open · Fast Delivery</span>
              </div>

              <h1 className="mb-6 text-5xl font-black leading-tight text-white lg:text-6xl xl:text-7xl">
                Order{" "}
                <span className="gradient-text">Delicious</span>
                <br />
                Food From
                <br />
                <span className="text-primary-400">Your Campus</span>
              </h1>

              <p className="mb-8 max-w-lg text-lg leading-relaxed text-white/60">
                Fresh, hot meals from your campus canteen — delivered straight to your seat. No queues, no waiting.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/menu">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary-500 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-primary-500/40 hover:bg-primary-600 transition-colors cursor-pointer"
                  >
                    Order Now
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
                <Link href="/register">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/20 px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Sign Up Free
                  </motion.span>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 flex flex-wrap gap-6">
                {stats.map(({ icon: Icon, value, label }) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/20">
                      <Icon className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-white">{value}</p>
                      <p className="text-xs text-white/50">{label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Floating food emojis visual */}
          <div className="relative hidden h-125 lg:block">
            {/* Central plate */}
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="flex h-56 w-56 items-center justify-center rounded-full bg-linear-to-br from-primary-500/30 to-accent-400/20 shadow-2xl shadow-primary-500/20 text-9xl">
                🍽️
              </div>
            </motion.div>

            {/* Orbiting foods */}
            {floatingFoods.map(({ emoji, className, delay }) => (
              <motion.div
                key={emoji}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
                transition={{ delay, duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute ${className} flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm text-3xl shadow-xl border border-white/20`}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fffaf5" />
        </svg>
      </div>
    </section>
  );
}
