"use client";
import layout from "@/shared/styles/utility.module.scss";
import { Button } from "@/shared/ui/controls";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className={layout.pagePadding}>
      <h1>Не удалось открыть страницу</h1>
      <p className={layout.paragraphSpacing}>Попробуйте загрузить её ещё раз.</p>
      <Button onClick={reset}>Попробовать снова</Button>
    </main>
  );
}
