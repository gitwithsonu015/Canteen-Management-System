"use client";

const statusConfig = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500", label: "Pending" },
  preparing: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500", label: "Preparing" },
  completed: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", label: "Completed" },
  cancelled: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", label: "Cancelled" },
  available: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", label: "Available" },
  unavailable: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", label: "Unavailable" },
  new: { bg: "bg-primary-100", text: "text-primary-700", dot: "bg-primary-500", label: "New" },
};

export default function Badge({ status, label, className = "" }) {
  const config = statusConfig[status?.toLowerCase()] || {
    bg: "bg-dark-100",
    text: "text-dark-700",
    dot: "bg-dark-400",
    label: label || status,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {label || config.label}
    </span>
  );
}
