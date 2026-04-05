"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CartContext } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import { formatCurrency } from "@/utils/helpers";
import { Star, Plus, Minus, ChevronLeft, ShoppingCart, Clock, Flame, Leaf } from "lucide-react";
import toast from "react-hot-toast";

const FOOD_EMOJIS = { "Starters": "🥗", "Main Course": "🍛", "Beverages": "🧃", "Desserts": "🍰", "Snacks": "🍟", "Breakfast": "🍳" };

export default function FoodDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useContext(CartContext);
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchFood() {
      try {
        const res = await fetch(`/api/menu/${id}`);
        const data = await res.json();
        setFood(data.data || data);
      } catch {
        setFood(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchFood();
  }, [id]);

  function handleAddToCart() {
    if (!food) return;
    for (let i = 0; i < quantity; i++) addToCart(food);
    toast.success(`${quantity}x ${food.name} added to cart! 🛒`);
    router.push("/cart");
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-dark-50 flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      </>
    );
  }

  if (!food) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <span className="text-6xl">🔍</span>
          <h2 className="text-2xl font-bold">Item not found</h2>
          <Link href="/menu" className="text-primary-600 hover:underline">Back to Menu</Link>
        </div>
      </>
    );
  }

  const emoji = FOOD_EMOJIS[food.category] || "🍽️";
  const rating = food.rating || 4.8;
  const reviews = food.reviews || 128;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-50 py-10">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          {/* Back */}
          <Link href="/menu" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-dark-600 hover:text-dark-900">
            <ChevronLeft className="h-4 w-4" />
            Back to Menu
          </Link>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center rounded-3xl bg-linear-to-br from-primary-50 to-accent-300/20 p-12 shadow-lg"
            >
              <span className="text-[10rem]">{emoji}</span>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col justify-center"
            >
              <span className="mb-3 inline-flex w-fit rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-700">
                {food.category}
              </span>
              <h1 className="mb-3 text-4xl font-black text-dark-900">{food.name}</h1>

              {/* Rating */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-accent-400 text-accent-400" : "text-dark-300"}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-dark-800">{rating}</span>
                <span className="text-sm text-dark-400">({reviews} reviews)</span>
              </div>

              {/* Tags */}
              <div className="mb-6 flex flex-wrap gap-2">
                {[
                  { icon: Clock, label: "10-15 min", color: "bg-blue-50 text-blue-700" },
                  { icon: Flame, label: "520 kcal", color: "bg-orange-50 text-orange-700" },
                  { icon: Leaf, label: "Fresh", color: "bg-emerald-50 text-emerald-700" },
                ].map(({ icon: Icon, label, color }) => (
                  <span key={label} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${color}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                ))}
              </div>

              <p className="mb-6 text-3xl font-black text-primary-600">{formatCurrency(food.price)}</p>

              {food.description && (
                <p className="mb-6 text-dark-600 leading-relaxed">{food.description}</p>
              )}

              {/* Quantity + Add */}
              {food.available !== false ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 rounded-2xl border-2 border-dark-200 px-4 py-3">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-dark-600 hover:text-dark-900">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-lg font-black text-dark-900">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-dark-600 hover:text-dark-900">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary-500 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/30 hover:bg-primary-600 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart · {formatCurrency(food.price * quantity)}
                  </motion.button>
                </div>
              ) : (
                <div className="rounded-2xl bg-red-50 px-6 py-4 text-center text-red-600 font-semibold border border-red-200">
                  Currently Unavailable
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
