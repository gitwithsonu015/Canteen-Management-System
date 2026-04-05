"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "B.Tech 3rd Year",
    quote: "SityogCanteen has completely changed how I eat on campus. No more standing in long queues! The food is always fresh and hot.",
    rating: 5,
    avatar: "PS",
    color: "bg-primary-500",
  },
  {
    name: "Rahul Gupta",
    role: "MBA Student",
    quote: "Super convenient for busy days between classes. The menu variety is amazing and ordering takes less than 2 minutes.",
    rating: 5,
    avatar: "RG",
    color: "bg-violet-500",
  },
  {
    name: "Anjali Patel",
    role: "M.Sc Biology",
    quote: "Love the variety! From healthy salads to indulgent desserts, they have it all. Real-time order tracking is a game-changer.",
    rating: 5,
    avatar: "AP",
    color: "bg-emerald-500",
  },
  {
    name: "Karan Singh",
    role: "B.Com Final Year",
    quote: "The new app interface is so smooth. I can track my order status live and the food always arrives exactly when expected.",
    rating: 4,
    avatar: "KS",
    color: "bg-cyan-500",
  },
  {
    name: "Meera Joshi",
    role: "Ph.D. Scholar",
    quote: "As someone who spends long hours in the lab, being able to order food without losing my spot has been a lifesaver!",
    rating: 5,
    avatar: "MJ",
    color: "bg-rose-500",
  },
  {
    name: "Arjun Nair",
    role: "B.E. 2nd Year",
    quote: "The Butter Chicken Thali is unbeatable. Ordered it 15 times already this semester. SityogCanteen = best decision ever.",
    rating: 5,
    avatar: "AN",
    color: "bg-amber-500",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-dark-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary-500">⭐ Reviews</p>
          <h2 className="text-4xl font-black text-dark-900">What Students Say</h2>
          <p className="mt-2 text-dark-500">Loved by thousands of hungry students</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map(({ name, role, quote, rating, avatar, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-white p-6 shadow-md shadow-dark-200/30 border border-dark-100 hover:shadow-xl hover:border-primary-200 transition-all"
            >
              <Quote className="mb-4 h-8 w-8 text-primary-200" />
              <p className="mb-6 text-sm leading-relaxed text-dark-700">&ldquo;{quote}&rdquo;</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color} text-sm font-bold text-white`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dark-900">{name}</p>
                    <p className="text-xs text-dark-400">{role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
