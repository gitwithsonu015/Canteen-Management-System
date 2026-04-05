"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  ChefHat,
  TrendingUp,
  Menu,
} from "lucide-react";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Menu Management", icon: UtensilsCrossed },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="flex h-screen w-64 flex-col bg-dark-950 text-white shadow-2xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 shadow-lg shadow-primary-500/30">
          <ChefHat className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-lg font-black">
            Campus<span className="text-primary-400">Eats</span>
          </p>
          <p className="text-xs text-white/40 font-medium">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
          Main Menu
        </p>
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
          return (
            <Link key={link.href} href={link.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="ml-auto h-2 w-2 rounded-full bg-white"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.name || "Admin"}</p>
            <p className="truncate text-xs text-white/40">{user?.email || "admin@campus.edu"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );


  // const userLinks = [
  //   { href: "/dashboard", label: "Dashboard" },
  //   { href: "/menu", label: "Menu" },
  //   { href: "/cart", label: "Cart" },
  //   { href: "/orders", label: "Orders" },
  // ];

  // const links = admin ? adminLinks : userLinks;

  // return (
  //   <aside className="rounded-xl border border-slate-200 bg-white p-4">
  //     <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
  //       {admin ? "Admin Panel" : "Navigation"}
  //     </h3>
  //     <div className="space-y-2">
  //       {links.map((link) => (
  //         <Link
  //           key={link.href}
  //           href={link.href}
  //           className={`block rounded-md px-3 py-2 text-sm ${
  //             pathname === link.href ? "bg-blue-100 text-blue-700" : "text-slate-700 hover:bg-slate-100"
  //           }`}
  //         >
  //           {link.label}
  //         </Link>
  //       ))}
  //     </div>
  //   </aside>
  // );
}
