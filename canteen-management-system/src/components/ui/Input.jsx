"use client";

import { AlertCircle } from "lucide-react";

export default function Input({ label, error, className = "", icon: Icon, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-dark-700">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <input
          className={`
            w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-dark-900
            placeholder:text-dark-400 outline-none transition-all duration-200
            focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10
            ${error ? "border-red-400 focus:border-red-400" : "border-dark-200"}
            ${Icon ? "pl-10" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3 w-3" />{error}</p>}
    </div>
  );
}
