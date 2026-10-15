"use client";
import { analyticsMock } from "@/entities/analytics/model/mock";
import { Card, SectionHeader } from "@/shared/ui/controls";
import { Icon } from "@/shared/ui/icon";
import Link from "@/shared/ui/link";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import s from "./analytics.module.scss";
export function BookingSummary() {
  return (
    <Card>
      <SectionHeader
        title='Записи'
        action={
          <Link href='/dashboard/bookings' aria-label='Открыть записи'>
            <Icon name='up' size={18} />
          </Link>
        }
      />
      <div className={s.donut}>
        <div className={s.donutChart}>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={analyticsMock.bookings}
                dataKey='value'
                innerRadius={58}
                outerRadius={72}
                paddingAngle={4}
                stroke='none'
                startAngle={90}
                endAngle={-270}
                isAnimationActive={false}
              >
                {analyticsMock.bookings.map(d => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={s.donutLabel}>
          <strong>128</strong>
          <small>за этот период</small>
        </div>
      </div>
      <div className={s.legend}>
        {analyticsMock.bookings.map(d => (
          <Link
            key={d.name}
            href={`/dashboard/bookings?status=${encodeURIComponent(d.name === "Завершены" ? "Завершена" : d.name === "Ожидают" ? "Ожидает" : d.name === "Отменены" ? "Отменена" : "Не пришёл")}`}
          >
            <span>
              <i style={{ background: d.color }} />
              {d.name}
            </span>
            <strong>{d.value}</strong>
          </Link>
        ))}
      </div>
      <div className={s.cancelReasons}>
        <span>Причины отмен</span>
        <div>
          <span>Клиентом</span>
          <strong>6</strong>
        </div>
        <div>
          <span>Сервисом</span>
          <strong>2</strong>
        </div>
      </div>
    </Card>
  );
}
