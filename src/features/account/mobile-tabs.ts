import { BookOpen, Home, Search, User } from "lucide-react";
import type { TabItem } from "@/components/layout/mobile-tab-bar";

export type LearnerTabKey = "home" | "courses" | "catalog" | "profile";

const TAB_CONFIG: {
  key: LearnerTabKey;
  href: string;
  icon: TabItem["icon"];
}[] = [
  { key: "home", href: "/tableau-de-bord", icon: Home },
  { key: "courses", href: "/tableau-de-bord", icon: BookOpen },
  { key: "catalog", href: "/formations", icon: Search },
  { key: "profile", href: "/profil", icon: User },
];

export function getLearnerTabItems(
  active: LearnerTabKey,
  labels: Record<LearnerTabKey, string>,
): TabItem[] {
  return TAB_CONFIG.map((tab) => ({
    label: labels[tab.key],
    href: tab.href,
    icon: tab.icon,
    active: tab.key === active,
  }));
}
