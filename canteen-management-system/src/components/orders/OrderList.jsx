"use client";

import OrderCard from "@/components/orders/OrderCard";

export default function OrderList({ orders, adminMode = false, onUpdateStatus }) {
  if (!orders.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        No orders found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          adminMode={adminMode}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
}
