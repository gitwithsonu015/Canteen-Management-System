"use client";

import FoodCard from "@/components/menu/FoodCard";

export default function MenuList({ foods, onAdd, onEdit, onDelete, adminMode = false }) {
  if (!foods.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        No food items found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {foods.map((food) => (
        <FoodCard
          key={food._id}
          food={food}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
          adminMode={adminMode}
        />
      ))}
    </div>
  );
}
