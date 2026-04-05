"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/utils/helpers";
import { Star, Plus, Pencil, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";

const FOOD_EMOJIS = { "Starters": "🥗", "Main Course": "🍛", "Beverages": "🥤", "Desserts": "🍨", "Snacks": "🍟", "Breakfast": "🍳" };

export default function FoodCard({ food, onAdd, onEdit, onDelete, adminMode = false }) {
  const emoji = FOOD_EMOJIS[food.category] || "🍽️";
  const rating = food.rating;
  const reviews = food.reviews ;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-2xl bg-white shadow-md shadow-dark-200/30 border border-dark-100 hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-200 transition-all duration-300"
    >
      {/* Image / Placeholder */}
      <div className="relative h-48 overflow-hidden bg-linear-to-br from-primary-50 to-accent-300/20">
        {food.image && food.image.startsWith("/") && food.image !== "/next.svg" ? (
          <Image src={food.image} alt={food.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" width={200} height={200} />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-7xl">{emoji}</span>
          </div>
        )}
        {/* Badge */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-dark-700 shadow-sm">
            {food.category}
          </span>
        </div>
        {!food.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-950/60">
            <span className="rounded-full bg-red-500 px-4 py-1.5 text-sm font-bold text-white">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 text-base font-bold text-dark-900 line-clamp-1">{food.name}</h3>
        <div className="mb-3 flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
          <span className="text-xs font-bold text-dark-800">{rating}</span>
          <span className="text-xs text-dark-400">({reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xl font-black text-primary-600">{formatCurrency(food.price)}</p>

          {adminMode ? (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(food)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete?.(food._id)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAdd?.(food)}
              disabled={!food.available}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
