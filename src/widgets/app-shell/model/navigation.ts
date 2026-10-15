import type { IconName } from "@/shared/ui/icon";

export const dashboardLinks: {
  href: string;
  label: string;
  icon: IconName;
}[] = [
  { href: "/dashboard", label: "Обзор", icon: "chart" },
  { href: "/dashboard/bookings", label: "Записи", icon: "calendar" },
  { href: "/dashboard/clients", label: "Клиенты", icon: "users" },
  { href: "/dashboard/services", label: "Услуги", icon: "wrench" },
  { href: "/dashboard/team", label: "Команда", icon: "user" },
  { href: "/dashboard/workshop", label: "Мастерская", icon: "garage" },
  { href: "/dashboard/settings", label: "Настройки", icon: "settings" },
];
