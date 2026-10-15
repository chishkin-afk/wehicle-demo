"use client";
import { useSearchParams } from "next/navigation";
export function useQueryState(key: string, fallback: string) {
  const params = useSearchParams();
  const value = params.get(key) || fallback;
  const setValue = (v: string) => {
    const url = new URL(window.location.href);
    const query = url.searchParams;
    if (v === fallback) query.delete(key);
    else query.set(key, v);
    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  };
  return [value, setValue] as const;
}
