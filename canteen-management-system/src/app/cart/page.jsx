"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { createOrder } from "@/services/orderService";
import { formatCurrency, mapOrderPayloadFromCart } from "@/utils/helpers";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Tag, ChefHat } from "lucide-react";
import toast from "react-hot-toast";

const FOOD_EMOJIS = { "Starters": "🥗", "Main Course": "🍛", "Beverages": "🧃", "Desserts": "🍰", "Snacks": "🍟", "Breakfast": "🍳" };

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice } = useContext(CartContext);
  const { token } = useAuth();
  const [placing, setPlacing] = useState(false);

  const delivery = totalPrice > 0 ? 20 : 0;
  const taxes = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + delivery + taxes;

  async function handlePlaceOrder() {
    setPlacing(true);
    try {
      await createOrder(
        { items: mapOrderPayloadFromCart(cartItems), totalPrice: grandTotal, paymentStatus: "unpaid" },
        token
      );
      clearCart();
      toast.success("Order placed successfully! 🎉");
      router.push("/orders");
    } catch (err) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-50 py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-2 text-3xl font-black text-dark-900">My Cart</h1>
            <p className="mb-8 text-dark-500">{cartItems.length === 0 ? "Your cart is empty" : `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""} in cart`}</p>
          </motion.div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center rounded-3xl bg-white py-24 shadow-sm border border-dark-100"
            >
              <span className="mb-6 text-8xl">🛒</span>
              <h2 className="mb-2 text-2xl font-bold text-dark-800">Your cart is empty</h2>
              <p className="mb-8 text-dark-500">Looks like you haven&apos;t added anything yet</p>
              <Link href="/menu">
                <Button size="lg" icon={ShoppingCart}>Browse Menu</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => {
                    const emoji = FOOD_EMOJIS[item.category] || "🍽️";
                    return (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-dark-100"
                      >
                        {/* Item emoji */}
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-3xl">
                          {emoji}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-dark-900 truncate">{item.name}</h3>
                          <p className="text-sm text-dark-500">{formatCurrency(item.price)} each</p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => item.quantity > 1 ? updateQuantity(item._id, item.quantity - 1) : removeFromCart(item._id)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-dark-100 text-dark-700 hover:bg-dark-200 transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-dark-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Item total */}
                        <p className="w-20 text-right font-black text-dark-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>

                        {/* Remove */}
                        <button
                          onClick={() => { removeFromCart(item._id); toast.success("Item removed"); }}
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-dark-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Clear cart */}
                <button
                  onClick={() => { clearCart(); toast.success("Cart cleared"); }}
                  className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                >
                  Clear cart
                </button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="sticky top-24 rounded-2xl bg-white p-6 shadow-md border border-dark-100"
                >
                  <h2 className="mb-6 text-xl font-bold text-dark-900">Order Summary</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-dark-600">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span className="font-semibold">{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-dark-600">
                      <span>Delivery</span>
                      <span className="font-semibold">{formatCurrency(delivery)}</span>
                    </div>
                    <div className="flex justify-between text-dark-600">
                      <span>Taxes (5%)</span>
                      <span className="font-semibold">{formatCurrency(taxes)}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700">
                      <Tag className="h-4 w-4" />
                      <span className="text-xs font-semibold">Campus member discount applied</span>
                    </div>
                    <div className="border-t border-dark-100 pt-3">
                      <div className="flex justify-between">
                        <span className="text-base font-black text-dark-900">Total</span>
                        <span className="text-xl font-black text-primary-600">{formatCurrency(grandTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    fullWidth
                    size="lg"
                    className="mt-6"
                    loading={placing}
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </Button>
                  <p className="mt-3 text-center text-xs text-dark-400">
                    You can track your order in real-time after placing
                  </p>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
