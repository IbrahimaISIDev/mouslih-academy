import {
  BarChart3,
  BookOpen,
  LayoutDashboard,
  Mail,
  Package,
  Quote,
  RotateCcw,
  Users,
} from "lucide-react";
import type { AdminNavItem } from "@/components/layout/admin-sidebar";

export type AdminNavKey =
  | "dashboard"
  | "audience"
  | "courses"
  | "users"
  | "messages"
  | "orders"
  | "testimonials";

export interface AdminNavLabels {
  dashboard: string;
  audience: string;
  courses: string;
  users: string;
  messages: string;
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
      label: labels.audience,
      href: "/admin/audience",
      icon: BarChart3,
      active: active === "audience",
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
      label: labels.messages,
      href: "/admin/messages",
      icon: Mail,
      active: active === "messages",
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
      href: "/admin/temoignages",
      icon: Quote,
      active: active === "testimonials",
    },
  ];
}
