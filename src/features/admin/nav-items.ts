import { BookOpen, LayoutDashboard, Package, Quote, RotateCcw, Users } from "lucide-react";
import type { AdminNavItem } from "@/components/layout/admin-sidebar";

export type AdminNavKey = "dashboard" | "courses" | "users" | "orders";

export interface AdminNavLabels {
  dashboard: string;
  courses: string;
  users: string;
  orders: string;
  corrections: string;
  testimonials: string;
}

export function getAdminNavItems(
  active: AdminNavKey,
  labels: AdminNavLabels,
  ordersCount: number,
  correctionsCount: number,
): AdminNavItem[] {
  return [
    {
      label: labels.dashboard,
      href: "/admin",
      icon: LayoutDashboard,
      active: active === "dashboard",
    },
    {
      label: labels.courses,
      href: "/admin/formations",
      icon: BookOpen,
      active: active === "courses",
    },
    {
      label: labels.users,
      href: "/admin/utilisateurs",
      icon: Users,
      active: active === "users",
    },
    {
      label: labels.orders,
      href: "/admin/commandes",
      icon: Package,
      active: active === "orders",
      count: ordersCount,
    },
    {
      label: labels.corrections,
      icon: RotateCcw,
      count: correctionsCount,
    },
    {
      label: labels.testimonials,
      icon: Quote,
    },
  ];
}
