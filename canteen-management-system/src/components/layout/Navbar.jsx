"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ChefHat, LayoutDashboard, UtensilsCrossed, ClipboardList, Shield, LogOut, User } from "lucide-react";



export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useContext(CartContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/cart", label: "Cart", icon: ShoppingCart },
    { href: "/orders", label: "Orders", icon: ClipboardList },
  ];
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
    setMobileOpen(false);
  }

  // Don't show navbar on admin pages
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md shadow-dark-200/20 border-b border-dark-100"
            : "bg-white"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 shadow-lg shadow-primary-500/30 group-hover:bg-primary-600 transition-colors">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black text-dark-900">
              Sityog<span className="text-primary-500">Canteen</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {isAuthenticated &&
              navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-primary-50 text-primary-600"
                        : "text-dark-600 hover:bg-dark-50 hover:text-dark-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-violet-600 hover:bg-violet-50 transition-all"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Link
                href="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </motion.span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-dark-50 px-3 py-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-semibold text-dark-800">{user?.name?.split(" ")[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl border-2 border-dark-200 px-3 py-2 text-sm font-semibold text-dark-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-dark-700 hover:bg-dark-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/admin/login"
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  Admin Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-dark-100 transition-colors md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sticky top-[60px] z-30 border-b border-dark-100 bg-white shadow-xl md:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
              {isAuthenticated &&
                navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                        pathname === link.href
                          ? "bg-primary-50 text-primary-600"
                          : "text-dark-700 hover:bg-dark-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-violet-600 hover:bg-violet-50"
                >
                  <Shield className="h-5 w-5" />
                  Admin Panel
                </Link>
              )}
              <div className="pt-3 border-t border-dark-100">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out ({user?.name})
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-dark-700 hover:bg-dark-50"
                    >
                      <User className="h-5 w-5" />
                      Sign In
                    </Link>
                    <Link
                      href="/admin/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-50"
                    >
                      <Shield className="h-5 w-5" />
                      Admin Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center rounded-xl bg-primary-500 py-3 text-sm font-semibold text-white"
                    >
                      Get Started Free
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

