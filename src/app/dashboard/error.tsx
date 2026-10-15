"use client";

import { Button, Card } from "@/shared/ui/controls";
import s from "@/shared/styles/screen.module.scss";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <Card>
      <h1>Не удалось открыть раздел</h1>
      <p className={s.muted}>Попробуйте загрузить его ещё раз.</p>
      <div className={s.detailActions}>
        <Button onClick={reset}>Попробовать снова</Button>
      </div>
    </Card>
  );
}
