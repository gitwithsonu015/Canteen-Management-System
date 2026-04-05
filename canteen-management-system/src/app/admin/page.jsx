"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminEntryPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/admin/login");
      return;
    }

    if (!isAdmin) {
      router.replace("/dashboard");
      return;
    }

    router.replace("/admin/dashboard");
  }, [isAuthenticated, isAdmin, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-50">
      <p className="text-sm font-semibold text-dark-500">Redirecting...</p>
    </div>
  );
}
