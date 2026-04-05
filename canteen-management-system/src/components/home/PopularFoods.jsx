"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Plus, ArrowRight } from "lucide-react";
import { CartContext } from "@/context/CartContext";
import { getMenu } from "@/services/menuService";
import { formatCurrency } from "@/utils/helpers";
import toast from "react-hot-toast";

const tagColors = {
  "Bestseller": "bg-primary-500 text-white",
  "Popular": "bg-emerald-500 text-white",
  "Fresh": "bg-cyan-500 text-white",
  "Loved": "bg-rose-500 text-white",
  "New": "bg-violet-500 text-white",
  "Sweet": "bg-accent-400 text-dark-900",
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1668236543090-82eba5ee5973?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
];

const tagOrder = ["Bestseller", "Popular", "Fresh", "Loved", "New", "Sweet"];

export default function PopularFoods({ onAddToCart }) {
  const { addToCart } = useContext(CartContext);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    async function fetchPopularFoods() {
      try {
        const response = await getMenu();
        const menuItems = Array.isArray(response?.data) ? response.data : [];
        setFoods(menuItems);
      } catch {
        setFoods([]);
      }
    }

    fetchPopularFoods();
  }, []);

  const popularItems = useMemo(() => {
    const availableFoods = foods.filter((item) => item.available !== false);
    return availableFoods.slice(0, 6).map((item, index) => ({
      ...item,
      tag: tagOrder[index % tagOrder.length],
      rating: Number(item.rating) || 4.7,
      reviews: Number(item.reviews) || (120 + index * 37),
      image: item.image || fallbackImages[index % fallbackImages.length],
    }));
  }, [foods]);

  function handleAddToCart(item) {
    (onAddToCart || addToCart)?.(item);
    toast.success(`${item.name} added to cart!`);
  }

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary-500">🔥 Trending Now</p>
            <h2 className="text-4xl font-black text-dark-900">Popular Foods</h2>
            <p className="mt-2 text-dark-500">Most loved dishes by our campus community</p>
          </div>
          <Link href="/menu">
            <motion.span
              whileHover={{ x: 4 }}
              className="hidden items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 md:flex cursor-pointer"
            >
              View All Menu <ArrowRight className="h-4 w-4" />
            </motion.span>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-md hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-200 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-dark-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-dark-950/55 via-dark-950/10 to-transparent" />
                <div className="absolute left-3 top-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tagColors[item.tag]}`}>
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-semibold text-dark-400">{item.category}</span>
                </div>
                <h3 className="mb-1 text-base font-bold text-dark-900">{item.name}</h3>
                <div className="mb-3 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                  <span className="text-xs font-bold text-dark-800">{item.rating}</span>
                  <span className="text-xs text-dark-400">({item.reviews} reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-primary-600">{formatCurrency(item.price)}</p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAddToCart(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}

          {popularItems.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dark-100 bg-dark-50 p-8 text-center text-sm font-semibold text-dark-500">
              No popular items available right now.
            </div>
          )}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link href="/menu">
            <span className="inline-flex items-center gap-2 rounded-2xl bg-primary-50 px-6 py-3 text-sm font-bold text-primary-600 cursor-pointer">
              View Full Menu <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
