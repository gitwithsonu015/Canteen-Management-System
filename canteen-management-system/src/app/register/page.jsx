"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { User, Mail, Lock, ChefHat, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const PERKS = [
  'Skip the canteen queue every time',
  'Real-time order tracking',
  'Order history & reorder in 1 click',
  'Exclusive campus deals & offers',
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to SityogCanteen 🎉');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-dark-950 via-dark-900 to-primary-900/20 relative overflow-hidden">
        <div className="absolute -top-40 -right-20 h-80 w-80 rounded-full bg-primary-500/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-accent-400/10 blur-3xl" />
        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500 shadow-2xl shadow-primary-500/40">
              <ChefHat className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-black text-white">Sityog<span className="text-primary-400">Canteen</span></span>
          </Link>
        </div>
        <div className="relative">
          <div className="mb-6 text-8xl">🎓</div>
          <h2 className="mb-4 text-5xl font-black leading-tight text-white">
            Join 5,000+ <br /><span className="text-primary-400">students</span>
          </h2>
          <p className="mb-8 text-lg text-white/50">The smarter way to eat on campus.</p>
          <ul className="space-y-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-white/70">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-500">
                  <Check className="h-3 w-3 text-white" />
                </div>
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative text-sm text-white/30">© {new Date().getFullYear()} SityogCanteen</div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black text-dark-900">Sityog<span className="text-primary-500">Canteen</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-dark-900">Create Account ✨</h1>
            <p className="mt-2 text-dark-500">Start ordering in under 2 minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              name="name"
              required
              placeholder="Your Name"
              icon={User}
              value={form.name}
              onChange={handleChange}
            />
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
              minLength={6}
              placeholder="Min 6 characters"
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
              Create Account
            </Button>

            <p className="text-center text-xs text-dark-400">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-dark-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

