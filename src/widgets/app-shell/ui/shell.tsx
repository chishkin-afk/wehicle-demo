"use client";

import { PageLoading } from "@/shared/ui/page-loading";
import Link from "@/shared/ui/link";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { DashboardHeader } from "./header";
import { Sidebar } from "./sidebar";
import s from "./shell.module.scss";

export function AppShell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    const viewport = window.matchMedia("(max-width: 760px)");
    const closeOnDesktop = () => {
      if (!viewport.matches) setMenu(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    viewport.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", closeOnEscape);
      viewport.removeEventListener("change", closeOnDesktop);
    };
  }, [menu]);

  return (
    <div className={s.shell}>
      <Link href='#dashboard-content' className={s.skipLink}>
        К содержимому
      </Link>
      <Sidebar open={menu} onClose={() => setMenu(false)} />
      {menu && (
        <button
          className={s.scrim}
          aria-label='Закрыть меню'
          onClick={() => setMenu(false)}
          tabIndex={-1}
        />
      )}
      <div className={s.main}>
        <DashboardHeader
          menuOpen={menu}
          onToggleMenu={() => setMenu(open => !open)}
        />
        <main id='dashboard-content' className={s.content} tabIndex={-1}>
          <Suspense fallback={<PageLoading />}>{children}</Suspense>
          <div className={s.pending} aria-hidden='true'>
            <PageLoading />
          </div>
        </main>
        <footer className={s.footer}>
          <span>Wehicle — работа в своём ритме</span>
          <span>Демонстрационные данные</span>
        </footer>
      </div>
    </div>
  );
}
