"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const variantStyles = {
  primary: "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25",
  secondary: "bg-dark-900 hover:bg-dark-800 text-white shadow-lg shadow-dark-900/20",
  outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50",
  ghost: "text-dark-700 hover:bg-dark-100",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25",
  success: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25",
  accent: "bg-accent-400 hover:bg-accent-500 text-dark-900 font-bold shadow-lg shadow-accent-400/25",
};

const sizeStyles = {
  xs: "px-3 py-1.5 text-xs",
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
  xl: "px-10 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  className = "",
  fullWidth = false,
  onClick,
  type = "button",
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && Icon && iconPosition === "left" && <Icon className="h-4 w-4" />}
      {children}
      {!loading && Icon && iconPosition === "right" && <Icon className="h-4 w-4" />}
    </motion.button>
  );
}

