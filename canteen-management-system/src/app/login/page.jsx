"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Mail, Lock, ChefHat, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await login(form);
      toast.success(`Welcome back, ${result.data.user.name}! 🎉`);
      if (result.data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-linear-to-br from-dark-950 via-dark-900 to-primary-900/20 relative overflow-hidden">
        <div className="absolute -top-40 -right-20 h-80 w-80 rounded-full bg-primary-500/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-accent-400/10 blur-3xl" />
        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500 shadow-2xl shadow-primary-500/40">
              <ChefHat className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-black text-white">Campus<span className="text-primary-400">Eats</span></span>
          </Link>
        </div>
        <div className="relative">
          <div className="mb-6 text-8xl">🍔</div>
          <h2 className="mb-4 text-5xl font-black leading-tight text-white">
            Hungry? <br /><span className="text-primary-400">We&apos;ve got you.</span>
          </h2>
          <p className="text-lg text-white/50">Order fresh campus canteen food — no queues, no hassle.</p>
          <div className="mt-8 flex gap-4">
            {["🍛 Fresh Daily", "⚡ Fast Orders", "📱 Track Live"].map((s) => (
              <span key={s} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">{s}</span>
            ))}
          </div>
        </div>
        <div className="relative text-sm text-white/30">© {new Date().getFullYear()} CampusEats</div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black text-dark-900">Campus<span className="text-primary-500">Eats</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-dark-900">Welcome back 👋</h1>
            <p className="mt-2 text-dark-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              placeholder="you@campus.edu"
              icon={Mail}
              value={form.email}
              onChange={handleChange}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              icon={Lock}
              value={form.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-primary-600 hover:text-primary-700">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
