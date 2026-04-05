"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { createFood, deleteFood, getMenu, updateFood } from "@/services/menuService";
import { uploadFoodImage } from "@/services/cloudinaryService";
import { formatCurrency } from "@/utils/helpers";
import { Plus, Pencil, Trash2, Search, UtensilsCrossed, ToggleLeft, ToggleRight, Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
const CATEGORIES = ["Starters", "Main Course", "Beverages", "Desserts", "Snacks", "Breakfast"];
const FOOD_EMOJIS = { "Starters": "🥗", "Main Course": "🍛", "Beverages": "🧃", "Desserts": "🍰", "Snacks": "🍟", "Breakfast": "🍳" };
const initialForm = { name: "", price: "", category: "Main Course", image: "", imageKey: "", available: true };

function FoodForm({ data, setData, onSubmit, submitLabel, onCancel, saving, token }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(data.image || "");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    setPreview(data.image || "");
  }, [data.image]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploadingImage(true);

    try {
      const uploaded = await uploadFoodImage(file, token);
      setData((prev) => ({
        ...prev,
        image: uploaded.image,
        imageKey: uploaded.imageKey,
      }));
      setPreview(uploaded.image);
      toast.success("Image uploaded");
    } catch (error) {
      setPreview(data.image || "");
      toast.error(error.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Food Name" required value={data.name} onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Butter Chicken" />
        <Input label="Price (₹)" type="number" required min="1" value={data.price} onChange={(e) => setData((p) => ({ ...p, price: e.target.value }))} placeholder="99" />
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-dark-700">Category</label>
          <select
            value={data.category}
            onChange={(e) => setData((p) => ({ ...p, category: e.target.value }))}
            className="w-full rounded-xl border-2 border-dark-200 bg-white px-4 py-3 text-sm text-dark-900 outline-none focus:border-primary-400"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2 rounded-2xl border border-dark-200 bg-dark-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-dark-900">Food Image</p>
              <p className="text-xs text-dark-500">Upload to Cloudinary before saving</p>
            </div>
            <Button
              type="button"
              variant="outline"
              icon={Upload}
              loading={uploadingImage}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? "Change Image" : "Upload Image"}
            </Button>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          <div className="mt-4 overflow-hidden rounded-2xl border border-dashed border-dark-200 bg-white">
            {preview ? (
              <div className="relative aspect-video w-full">
                <Image width={100} height={100} src={preview} alt={data.name || "Food preview"} className="h-full w-full object-cover" />

                {uploadingImage && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-dark-950/40 backdrop-blur-sm">
                    <div className="flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 text-xs font-semibold text-white">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading image...
                    </div>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-linear-to-t from-dark-950/75 to-transparent p-3">
                  <span className="truncate text-xs font-semibold text-white">{data.imageKey ? "Uploaded to Cloudinary" : "Preview ready"}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setData((p) => ({ ...p, image: "", imageKey: "" }));
                      setPreview("");
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative flex h-44 items-center justify-center text-center">
                {uploadingImage && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-dark-950/35 backdrop-blur-sm">
                    <div className="flex items-center gap-2 rounded-xl bg-dark-950/50 px-3 py-2 text-xs font-semibold text-white">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading image...
                    </div>
                  </div>
                )}
                <div>
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-dark-700">No image selected</p>
                  <p className="text-xs text-dark-500">PNG, JPG, WEBP supported by your Cloudinary settings</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setData((p) => ({ ...p, available: !p.available }))}>
          {data.available
            ? <ToggleRight className="h-7 w-7 text-emerald-500" />
            : <ToggleLeft className="h-7 w-7 text-dark-400" />}
        </button>
        <span className="text-sm font-semibold text-dark-700">{data.available ? "Available" : "Unavailable"}</span>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={saving} disabled={uploadingImage} size="md">{submitLabel}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminMenuPage() {
  const { token } = useAuth();
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchFoods = useCallback(async () => {
    try {
      const response = await getMenu();
      setFoods(response.data || []);
    } catch {
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFoods(); }, [fetchFoods]);

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await createFood({ ...form, price: Number(form.price) }, token);
      setForm(initialForm);
      setAddOpen(false);
      await fetchFoods();
      toast.success("Food item added! 🍽️");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteFood(id, token);
      await fetchFoods();
      setDeleteConfirm(null);
      toast.success("Item deleted");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleUpdate(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await updateFood(editing._id, { ...editing, price: Number(editing.price) }, token);
      setEditing(null);
      await fetchFoods();
      toast.success("Item updated! ✅");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const filtered = foods.filter((f) => f.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-screen overflow-hidden bg-dark-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-dark-100 bg-white px-8 py-4 shadow-sm">
          <div>
            <h1 className="text-xl font-black text-dark-900">Menu Management</h1>
            <p className="text-sm text-dark-500">{foods.length} items on menu</p>
          </div>
          <Button icon={Plus} onClick={() => setAddOpen(true)}>Add Food Item</Button>
        </div>

        <div className="p-8">
          {/* Search */}
          <div className="mb-6 relative max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-2 border-dark-200 bg-white py-2.5 pl-10 pr-4 text-sm text-dark-900 outline-none focus:border-primary-400 transition-colors"
            />
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-white shadow-md border border-dark-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-50">
                  <tr>
                    {["Item", "Category", "Price", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-dark-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-50">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="px-6 py-4"><div className="h-4 rounded bg-dark-100" /></td>
                        ))}
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <UtensilsCrossed className="mx-auto mb-3 h-10 w-10 text-dark-300" />
                        <p className="text-dark-500">No items found</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((food) => {
                      const emoji = FOOD_EMOJIS[food.category] || "🍽️";
                      return (
                        <tr
                          key={food._id}
                          className="hover:bg-dark-50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-xl shrink-0">
                                {food.image ? (
                                  <Image width={50} height={50} className="h-12 w-12 rounded-2xl object-contain" src={food.image} alt={food.name} />
                                ) : (
                                  <span>{emoji}</span>
                                )}
                              </div>
                              <p className="font-semibold text-dark-900">{food.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-dark-100 px-3 py-1 text-xs font-semibold text-dark-700">{food.category}</span>
                          </td>
                          <td className="px-6 py-4 font-bold text-dark-900">{formatCurrency(food.price)}</td>
                          <td className="px-6 py-4">
                            <Badge status={food.available ? "available" : "unavailable"} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditing({ ...food })}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(food)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal open={addOpen} title="Add New Food Item" onClose={() => setAddOpen(false)} size="lg">
        <FoodForm data={form} setData={setForm} onSubmit={handleCreate} submitLabel="Add Item" onCancel={() => setAddOpen(false)} saving={saving} token={token} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={Boolean(editing)} title="Edit Food Item" onClose={() => setEditing(null)} size="lg">
        {editing && <FoodForm data={editing} setData={setEditing} onSubmit={handleUpdate} submitLabel="Save Changes" onCancel={() => setEditing(null)} saving={saving} token={token} />}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={Boolean(deleteConfirm)} title="Delete Item?" onClose={() => setDeleteConfirm(null)} size="sm">
        {deleteConfirm && (
          <div className="text-center">
            <span className="mb-4 block text-5xl">🗑️</span>
            <p className="mb-2 font-semibold text-dark-900">Delete &ldquo;{deleteConfirm.name}&rdquo;?</p>
            <p className="mb-6 text-sm text-dark-500">This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="danger" fullWidth onClick={() => handleDelete(deleteConfirm._id)}>Delete</Button>
              <Button variant="ghost" fullWidth onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
