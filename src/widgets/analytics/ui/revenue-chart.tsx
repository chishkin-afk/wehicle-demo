"use client";
import { analyticsMock } from "@/entities/analytics/model/mock";
import { money } from "@/shared/lib/format";
import { Card, SectionHeader, Segmented } from "@/shared/ui/controls";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import s from "./analytics.module.scss";
export function RevenueChart() {
  const [period, setPeriod] = useState("daily");
  const data =
    period === "daily"
      ? analyticsMock.daily
      : period === "weekly"
        ? analyticsMock.weekly
        : analyticsMock.monthly;
  return (
    <Card className={s.chartCard}>
      <SectionHeader
        title='Динамика выручки'
        description='По завершённым визитам'
        action={
          <Segmented
            value={period}
            onChange={setPeriod}
            options={[
              { value: "daily", label: "День" },
              { value: "weekly", label: "Неделя" },
              { value: "monthly", label: "Месяц" },
            ]}
          />
        }
      />
      <div
        className={s.chart}
        role='img'
        aria-label='График выручки по завершённым визитам'
      >
        <ResponsiveContainer width='100%' height='100%' minWidth={0}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 5, left: -20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke='#f0f0f5' />
            <XAxis
              dataKey='day'
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9a9aa5", fontSize: 9 }}
              minTickGap={10}
              dy={9}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9a9aa5", fontSize: 9 }}
              tickFormatter={v => `${v / 1000} т.`}
            />
            <Tooltip
              cursor={{ fill: "#f5f5f9" }}
              formatter={v => money(Number(v))}
              contentStyle={{
                border: "0",
                borderRadius: "12px",
                boxShadow: "0 4px 24px #0001",
                fontSize: 11,
              }}
            />
            <Bar
              dataKey='value'
              name='Выручка'
              fill='#1b1b20'
              radius={[6, 6, 6, 6]}
              maxBarSize={25}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={s.chartFoot}>
        <span>
          <i /> Выручка
        </span>
        <span>
          В среднем{" "}
          <strong>
            {money(
              Math.round(data.reduce((a, b) => a + b.value, 0) / data.length),
            )}
          </strong>{" "}
          за{" "}
          {period === "daily" ? "день" : period === "weekly" ? "день" : "месяц"}
        </span>
      </div>
    </Card>
  );
}
