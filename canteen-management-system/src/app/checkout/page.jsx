"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CartContext } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createOrder } from "@/services/orderService";
import { formatCurrency, mapOrderPayloadFromCart } from "@/utils/helpers";
import { MapPin, CreditCard, CheckCircle, ChevronLeft, Wallet } from "lucide-react";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash on Pickup", icon: Wallet, desc: "Pay when you collect your order" },
  { id: "upi", label: "UPI / Wallet", icon: CreditCard, desc: "PhonePe, GPay, Paytm" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { token, user } = useAuth();
  const [payment, setPayment] = useState("cash");
  const [form, setForm] = useState({ name: user?.name || "", phone: "", location: "" });
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);

  const delivery = totalPrice > 0 ? 20 : 0;
  const taxes = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + delivery + taxes;

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPlacing(true);
    try {
      await createOrder(
        { items: mapOrderPayloadFromCart(cartItems), totalPrice: grandTotal, paymentStatus: payment === "cash" ? "unpaid" : "paid" },
        token
      );
      clearCart();
      setDone(true);
      setTimeout(() => router.push("/orders"), 2500);
    } catch (err) {
      toast.error(err.message || "Order failed");
    } finally {
      setPlacing(false);
    }
  }

  if (done) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-100 mb-6">
            <CheckCircle className="h-16 w-16 text-emerald-500" />
          </div>
        </motion.div>
        <h2 className="text-3xl font-black text-dark-900">Order Placed! 🎉</h2>
        <p className="mt-2 text-dark-500">Your food is being prepared. Redirecting to orders...</p>
        <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-dark-100">
          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.5 }} className="h-full bg-primary-500" />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <span className="text-6xl">🛒</span>
          <h2 className="text-2xl font-bold">Cart is empty</h2>
          <Link href="/menu" className="text-primary-600 hover:underline">Browse Menu</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-50 py-10">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <Link href="/cart" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-dark-600 hover:text-dark-900">
            <ChevronLeft className="h-4 w-4" /> Back to Cart
          </Link>
          <h1 className="mb-8 text-3xl font-black text-dark-900">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery info */}
                <div className="rounded-2xl bg-white p-6 shadow-md border border-dark-100">
                  <div className="mb-5 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary-500" />
                    <h2 className="text-lg font-bold text-dark-900">Delivery Details</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Your Name" name="name" required value={form.name} onChange={handleChange} placeholder="Full Name" />
                    <Input label="Phone Number" name="phone" required value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                    <div className="sm:col-span-2">
                      <Input label="Pickup Location / Table No." name="location" required value={form.location} onChange={handleChange} placeholder="e.g. Library Block, Table 12" icon={MapPin} />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="rounded-2xl bg-white p-6 shadow-md border border-dark-100">
                  <div className="mb-5 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary-500" />
                    <h2 className="text-lg font-bold text-dark-900">Payment Method</h2>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPayment(id)}
                        className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                          payment === id
                            ? "border-primary-500 bg-primary-50"
                            : "border-dark-200 hover:border-primary-300"
                        }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${payment === id ? "bg-primary-500" : "bg-dark-100"}`}>
                          <Icon className={`h-5 w-5 ${payment === id ? "text-white" : "text-dark-600"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-dark-900">{label}</p>
                          <p className="text-xs text-dark-500">{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-md border border-dark-100">
                  <h2 className="mb-5 text-xl font-bold text-dark-900">Order Summary</h2>
                  <div className="mb-4 max-h-48 overflow-y-auto space-y-2">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span className="text-dark-700">{item.name} x{item.quantity}</span>
                        <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 border-t border-dark-100 pt-4 text-sm">
                    <div className="flex justify-between text-dark-600"><span>Subtotal</span><span>{formatCurrency(totalPrice)}</span></div>
                    <div className="flex justify-between text-dark-600"><span>Delivery</span><span>{formatCurrency(delivery)}</span></div>
                    <div className="flex justify-between text-dark-600"><span>Taxes (5%)</span><span>{formatCurrency(taxes)}</span></div>
                    <div className="flex justify-between border-t border-dark-100 pt-2">
                      <span className="font-black text-dark-900">Total</span>
                      <span className="text-lg font-black text-primary-600">{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                  <Button type="submit" fullWidth size="lg" loading={placing} className="mt-6">
                    Place Order · {formatCurrency(grandTotal)}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
