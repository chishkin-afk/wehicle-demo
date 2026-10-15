"use client";

import { useDemo } from "@/entities/workspace/model/provider";
import { Avatar, Button, Dialog, Select } from "@/shared/ui/controls";
import { Icon } from "@/shared/ui/icon";
import Link from "@/shared/ui/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { dashboardLinks } from "../model/navigation";
import s from "./sidebar.module.scss";

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const path = usePathname();
  const [business, setBusiness] = useState(false);
  const { role, setRole, bookings } = useDemo();

  return (
    <>
      <aside
        id='dashboard-sidebar'
        aria-label='Боковая панель'
        className={`${s.sidebar} ${open ? s.open : ""}`}
      >
        <Link href='/' className={s.logo} onNavigate={onClose}>
          wehicle<span>.</span>
        </Link>
        <button className={s.business} onClick={() => setBusiness(true)}>
          <span className={s.businessIcon}>
            <Icon name='car' size={19} />
          </span>
          <span>
            <strong>Wehicle Service</strong>
            <small>Автосервис</small>
          </span>
          <Icon name='chevron' size={14} />
        </button>
        <p className={s.navLabel}>Рабочее пространство</p>
        <nav aria-label='Основная навигация'>
          {dashboardLinks
            .filter(l => l.href !== "/dashboard/settings")
            .filter(
              l => role !== "Мастер" || ["Записи", "Команда"].includes(l.label),
            )
            .map(l => (
              <Link
                key={l.href}
                href={l.href}
                onNavigate={onClose}
                className={`${s.navItem} ${path === l.href ? s.active : ""}`}
                aria-current={path === l.href ? "page" : undefined}
              >
                <Icon name={l.icon} size={20} />
                <span>{l.label}</span>
                {l.label === "Записи" && (
                  <small>
                    {
                      bookings.filter(
                        b =>
                          !["Завершена", "Отменена", "Не пришёл"].includes(
                            b.status,
                          ),
                      ).length
                    }
                  </small>
                )}
              </Link>
            ))}
        </nav>
        <div className={s.sidebarBottom}>
          <div className={s.support}>
            <span className={s.supportIcon}>
              <Icon name='lightning' size={20} />
            </span>
            <strong>Всё под контролем</strong>
            <p>
              Больше времени для того,
              <br />
              что действительно важно.
            </p>
            <Link href='/book' onNavigate={onClose}>
              Открыть онлайн-запись <Icon name='up' size={14} />
            </Link>
          </div>
          <Link
            href='/dashboard/settings'
            aria-current={path === "/dashboard/settings" ? "page" : undefined}
            onNavigate={onClose}
            className={`${s.navItem} ${path === "/dashboard/settings" ? s.active : ""}`}
          >
            <Icon name='settings' />
            <span>Настройки</span>
          </Link>
          <Link
            href='/dashboard/settings'
            className={s.user}
            onNavigate={onClose}
          >
            <Avatar name='Егор Фролов' />
            <span>
              <strong>Егор Фролов</strong>
              <small>{role}</small>
            </span>
            <Icon name='chevron' size={14} />
          </Link>
        </div>
      </aside>
      <Dialog
        open={business}
        onClose={() => setBusiness(false)}
        title='Рабочее пространство'
      >
        <p className={s.dialogText}>
          Wehicle Service · Москва
          <br />
          Выберите роль для просмотра демо.
        </p>
        <Select
          label='Роль'
          value={role}
          onChange={v => setRole(v as typeof role)}
          options={["Владелец", "Менеджер", "Мастер"].map(v => ({
            value: v,
            label: v,
          }))}
        />
        <div className={s.dialogActions}>
          <Button onClick={() => setBusiness(false)}>Продолжить</Button>
        </div>
      </Dialog>
    </>
  );
}
