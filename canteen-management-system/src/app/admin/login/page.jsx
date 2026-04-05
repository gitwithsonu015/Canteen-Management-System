"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, ChefHat, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();
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
      if (result?.data?.user?.role !== "admin") {
        logout();
        toast.error("This account is not an admin account");
        return;
      }
      toast.success(`Welcome admin, ${result.data.user.name}!`);
      router.push("/admin/dashboard");
    } catch (err) {
      toast.error(err.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-36 right-8 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute -bottom-36 left-8 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl"
      >
        <Link href="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black text-dark-900">Campus<span className="text-primary-500">Eats</span></span>
        </Link>

        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-700">
            <Shield className="h-3.5 w-3.5" />
            Admin Access
          </div>
          <h1 className="text-3xl font-black text-dark-900">Admin Login</h1>
          <p className="mt-2 text-dark-500">Sign in with your admin account to manage menu, orders and users.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Admin Email"
            name="email"
            type="email"
            required
            placeholder="admin@campus.edu"
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
            Sign In As Admin
          </Button>
        </form>

        <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Note</p>
          <p className="mt-1 text-sm text-violet-800">
            Only users with role <span className="font-bold">admin</span> can continue from this page.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-dark-500">
          Not an admin?{" "}
          <Link href="/login" className="font-bold text-primary-600 hover:text-primary-700">
            Go to user login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
