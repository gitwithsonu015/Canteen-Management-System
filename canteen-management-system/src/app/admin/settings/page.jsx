"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Settings, Bell, ShieldCheck, Clock, Store, Save } from "lucide-react";
import toast from "react-hot-toast";

const SECTION_ICONS = {
  general: Store,
  hours: Clock,
  notifications: Bell,
  security: ShieldCheck,
};

const SECTIONS = ["general", "hours", "notifications", "security"];

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState({
    canteenName: "CampusEats",
    contactEmail: "canteen@campus.edu",
    contactPhone: "+91 98765 43210",
    address: "Main Block, Campus Ground Floor",
    openTime: "08:00",
    closeTime: "20:00",
    closedDays: "Sunday",
    deliveryFee: "20",
    taxRate: "5",
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
  });

  function handleChange(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    toast.success("Settings saved successfully");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-dark-100 bg-white px-8 py-4 shadow-sm">
          <div>
            <h1 className="text-xl font-black text-dark-900">Settings</h1>
            <p className="text-sm text-dark-500">Manage your canteen configuration</p>
          </div>
          <Button onClick={handleSave} icon={Save} iconPosition="left" size="sm">
            Save Changes
          </Button>
        </div>

        <div className="p-8">
          <div className="flex gap-8">
            {/* Sidebar Nav */}
            <div className="w-52 shrink-0">
              <nav className="space-y-1">
                {SECTIONS.map((s) => {
                  const Icon = SECTION_ICONS[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setActiveSection(s)}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold capitalize transition-all ${
                        activeSection === s
                          ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                          : "text-dark-600 hover:bg-dark-100"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {s}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 rounded-2xl bg-white p-8 shadow-md border border-dark-100"
            >
              {activeSection === "general" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-black text-dark-900">General Settings</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Input label="Canteen Name" value={settings.canteenName} onChange={(e) => handleChange("canteenName", e.target.value)} />
                    <Input label="Contact Email" type="email" value={settings.contactEmail} onChange={(e) => handleChange("contactEmail", e.target.value)} />
                    <Input label="Contact Phone" value={settings.contactPhone} onChange={(e) => handleChange("contactPhone", e.target.value)} />
                    <Input label="Address" value={settings.address} onChange={(e) => handleChange("address", e.target.value)} />
                    <Input label="Delivery Fee (₹)" type="number" value={settings.deliveryFee} onChange={(e) => handleChange("deliveryFee", e.target.value)} />
                    <Input label="Tax Rate (%)" type="number" value={settings.taxRate} onChange={(e) => handleChange("taxRate", e.target.value)} />
                  </div>
                </div>
              )}

              {activeSection === "hours" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-black text-dark-900">Operating Hours</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Input label="Opening Time" type="time" value={settings.openTime} onChange={(e) => handleChange("openTime", e.target.value)} />
                    <Input label="Closing Time" type="time" value={settings.closeTime} onChange={(e) => handleChange("closeTime", e.target.value)} />
                    <Input label="Closed Days" value={settings.closedDays} onChange={(e) => handleChange("closedDays", e.target.value)} />
                  </div>
                </div>
              )}

              {activeSection === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-black text-dark-900">Notification Settings</h2>
                  {[
                    { key: "emailNotifications", label: "Email Notifications", desc: "Receive daily summary emails" },
                    { key: "orderAlerts", label: "New Order Alerts", desc: "Get notified for every new order" },
                    { key: "lowStockAlerts", label: "Low Stock Alerts", desc: "Alert when menu items run low" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between rounded-xl border-2 border-dark-100 p-4">
                      <div>
                        <p className="font-semibold text-dark-800">{label}</p>
                        <p className="text-sm text-dark-500">{desc}</p>
                      </div>
                      <button
                        onClick={() => handleChange(key, !settings[key])}
                        className={`relative h-6 w-11 rounded-full transition-colors ${settings[key] ? "bg-primary-500" : "bg-dark-200"}`}
                      >
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === "security" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-black text-dark-900">Security Settings</h2>
                  <div className="rounded-xl border-2 border-dark-100 p-6 space-y-4">
                    <p className="text-sm text-dark-600">Change the admin password to keep your account secure.</p>
                    <Input label="Current Password" type="password" placeholder="Enter current password" />
                    <Input label="New Password" type="password" placeholder="Enter new password" />
                    <Input label="Confirm New Password" type="password" placeholder="Repeat new password" />
                    <Button variant="primary" size="sm">Update Password</Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
