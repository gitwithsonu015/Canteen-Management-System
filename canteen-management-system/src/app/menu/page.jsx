"use client";

import { useContext, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "@/context/CartContext";
import FoodCard from "@/components/menu/FoodCard";
import CategoryCard from "@/components/menu/CategoryCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { getMenu } from "@/services/menuService";
import { Search, SlidersHorizontal, X, ChefHat } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = ["All", "Starters", "Main Course", "Beverages", "Desserts", "Snacks", "Breakfast"];
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
];

function MenuContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useContext(CartContext);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await getMenu();
        setFoods(response.data || []);
      } catch {
        setFoods([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  function handleAddToCart(food) {
    addToCart(food);
    toast.success(`${food.name} added to cart! 🛒`);
  }

  const filtered = foods
    .filter((f) => selectedCategory === "All" || f.category === selectedCategory)
    .filter((f) => f.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return (b.rating || 4.5) - (a.rating || 4.5);
      return 0;
    });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-50">
        {/* Header */}
        <div className="bg-dark-950 py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary-400">
                🍽️ Our Menu
              </p>
              <h1 className="text-4xl font-black text-white lg:text-5xl">Everything Delicious</h1>
              <p className="mt-2 text-white/50">
                {loading ? "Loading..." : `${foods.length} items available`}
              </p>
            </motion.div>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-8 flex gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search for biryani, burger, lassi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border-2 border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="relative">
                <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-full appearance-none rounded-2xl border-2 border-white/10 bg-white/5 py-4 pl-10 pr-5 text-sm text-white outline-none focus:border-primary-500/50 cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-dark-900">{o.label}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          {/* Category filters */}
          <div className="mb-8 flex gap-3 overflow-x-auto pb-3 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat}
                category={cat}
                selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </div>

          {/* Results count */}
          {!loading && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-semibold text-dark-600">
                {filtered.length === 0 ? "No items found" : `${filtered.length} item${filtered.length !== 1 ? "s" : ""} found`}
              </p>
              {(search || selectedCategory !== "All") && (
                <button
                  onClick={() => { setSearch(""); setSelectedCategory("All"); }}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <span className="mb-4 text-6xl">🔍</span>
              <h3 className="mb-2 text-xl font-bold text-dark-800">No items found</h3>
              <p className="text-dark-500">Try a different category or search term</p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence>
                {filtered.map((food) => (
                  <FoodCard key={food._id} food={food} onAdd={handleAddToCart} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-50 flex items-center justify-center"><ChefHat className="h-8 w-8 animate-spin text-primary-500" /></div>}>
      <MenuContent />
    </Suspense>
  );
}
