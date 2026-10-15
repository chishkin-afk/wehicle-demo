"use client";

import { Avatar } from "@/shared/ui/controls";
import { Icon } from "@/shared/ui/icon";
import Link from "@/shared/ui/link";
import { usePathname } from "next/navigation";
import { dashboardLinks } from "../model/navigation";
import s from "./shell.module.scss";

export function DashboardHeader({
  menuOpen,
  onToggleMenu,
}: {
  menuOpen: boolean;
  onToggleMenu: () => void;
}) {
  const path = usePathname();
  const label =
    dashboardLinks.find(link => link.href === path)?.label || "Обзор";

  return (
    <header className={s.topbar}>
      <div className={s.breadcrumb}>
        <button
          type='button'
          className={s.mobileMenu}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          aria-controls='dashboard-sidebar'
          onClick={onToggleMenu}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
        <span>Рабочее пространство</span>
        <Icon name='next' size={12} />
        <strong>{label}</strong>
      </div>
      <div className={s.topActions}>
        <span className={s.today}>Среда, 14 октября</span>
        <Link href='/dashboard/settings' aria-label='Мой профиль'>
          <Avatar name='Егор Фролов' />
        </Link>
      </div>
    </header>
  );
}
