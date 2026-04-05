"use client";

import Link from "next/link";
import { ChefHat, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  quickLinks: [
    { href: "/menu", label: "Browse Menu" },
    { href: "/cart", label: "Cart" },
    { href: "/orders", label: "My Orders" },
    { href: "/dashboard", label: "Dashboard" },
  ],
  categories: [
    { href: "/menu?category=starters", label: "Starters" },
    { href: "/menu?category=main-course", label: "Main Course" },
    { href: "/menu?category=beverages", label: "Beverages" },
    { href: "/menu?category=desserts", label: "Desserts" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 shadow-lg shadow-primary-500/30">
                <ChefHat className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black">
                Sityog<span className="text-primary-400">Canteen</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              Your campus canteen, reimagined. Order fresh, delicious meals from your favorite campus food spots with ease.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/60 hover:bg-primary-500 hover:text-white transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-sm font-bold uppercase tracking-widest text-white/30">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-5 text-sm font-bold uppercase tracking-widest text-white/30">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-sm font-bold uppercase tracking-widest text-white/30">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-primary-400 mt-0.5" />
                <span className="text-sm text-white/60">Campus Canteen, Main Building, Ground Floor</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary-400" />
                <span className="text-sm text-white/60">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary-400" />
                <span className="text-sm text-white/60">canteen@campus.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} SityogCanteen. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-white/30">
            <span>Made with</span>
            <span className="text-primary-400">SONU KUMAR UPADHYAY</span>
            <span>for Sityog Students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
