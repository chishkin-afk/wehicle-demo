"use client";
import { analyticsMock } from "@/entities/analytics/model/mock";
import { BookingDialog } from "@/features/booking/ui/booking-dialog";
import { useDemo } from "@/entities/workspace/model/provider";
import { money } from "@/shared/lib/format";
import {
  Avatar,
  Button,
  Card,
  PageHeader,
  SectionHeader,
  Status,
} from "@/shared/ui/controls";
import { Icon } from "@/shared/ui/icon";
import { BookingSummary } from "@/widgets/analytics/ui/booking-summary";
import { RevenueChart } from "@/widgets/analytics/ui/revenue-chart";
import Link from "@/shared/ui/link";
import { useState } from "react";
import s from "./dashboard.module.scss";
export default function Dashboard() {
  const { services, bookings, clients, team, bays, orders, role } = useDemo();
  const [newBooking, setNewBooking] = useState(false);
  const [range, setRange] = useState("1–13 октября 2026");
  const previous = range === "1–13 сентября 2026";
  const stats = analyticsMock;
  const exportCsv = () => {
    const blob = new Blob(
      [
        "\uFEFFПоказатель;Значение\nВыручка;" +
          (previous ? 526000 : stats.revenue) +
          "\nСредний чек;6000\nКлиенты;96\nПовторные;42%",
      ],
      { type: "text/csv;charset=utf-8;" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "wehicle-metrics.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  if (role === "Мастер")
    return (
      <Card>
        <h1>Ваш рабочий день</h1>
        <p>Расписание и записи доступны в рабочем пространстве.</p>
        <Link href='/dashboard/bookings'>Открыть мои записи</Link>
      </Card>
    );
  return (
    <>
      <PageHeader
        title='Обзор'
        description='Финансы, клиенты и загрузка автосервиса'
        actions={
          <>
            <label className={s.range}>
              <Icon name='calendar' size={16} />
              <select
                aria-label='Период метрик'
                value={range}
                onChange={e => setRange(e.target.value)}
              >
                <option>1–13 октября 2026</option>
                <option>1–13 сентября 2026</option>
              </select>
            </label>
            <Button variant='secondary' icon='export' onClick={exportCsv}>
              Экспорт
            </Button>
            <Button icon='plus' onClick={() => setNewBooking(true)}>
              Новая запись
            </Button>
          </>
        }
      />
      <div className={s.metrics}>
        <Card dark className={s.revenue}>
          <div className={s.metricLabel}>
            <span>Общая выручка</span>
            <Icon name='up' size={18} />
          </div>
          <strong>{money(previous ? 526000 : stats.revenue)}</strong>
          <div className={s.change}>
            <span>
              <Icon name='up' size={12} /> 18,6%
            </span>
            <small>к предыдущему периоду</small>
          </div>
        </Card>
        {[
          {
            label: "Средний чек",
            value: money(stats.average),
            icon: "wrench" as const,
            note: "↑ 7,4% к прошлому периоду",
          },
          {
            label: "Клиенты",
            value: previous ? "81" : String(stats.clients),
            icon: "users" as const,
            note: `${stats.totalClients.toLocaleString("ru-RU")} за всё время`,
          },
          {
            label: "Повторные визиты",
            value: stats.repeat + "%",
            icon: "calendar" as const,
            note: "40 из 96 клиентов",
          },
        ].map(m => (
          <Card key={m.label} className={s.metric}>
            <div className={s.metricLabel}>
              <span>{m.label}</span>
              <span className={s.metricIcon}>
                <Icon name={m.icon} size={16} />
              </span>
            </div>
            <strong>{m.value}</strong>
            <small>{m.note}</small>
          </Card>
        ))}
      </div>
      <div className={s.dashboardGrid}>
        <div className={s.left}>
          <RevenueChart />
          <Card>
            <SectionHeader
              title='Популярные услуги'
              description='По завершённым визитам'
              action={
                <Link href='/dashboard/services' className={s.textLink}>
                  Все услуги <Icon name='up' size={14} />
                </Link>
              }
            />
            <div className={s.serviceTable}>
              <div className={s.serviceLabels}>
                <span>Услуга</span>
                <span>Записи</span>
                <span>Доля</span>
              </div>
              {stats.popular.map(p => {
                const service = services.find(v => v.id === p.id);
                return (
                  <Link
                    key={p.id}
                    href='/dashboard/services'
                    className={s.serviceRow}
                  >
                    <span className={s.serviceName}>
                      <span className={s.serviceIcon}>
                        <Icon name={service?.icon || "wrench"} size={19} />
                      </span>
                      {service?.name}
                    </span>
                    <strong>{p.count}</strong>
                    <span className={s.share}>
                      {p.share.toLocaleString("ru-RU")}%
                      <span className={s.progress}>
                        <i style={{ width: `${p.share * 2}%` }} />
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </Card>
          <Card>
            <SectionHeader
              title='Ближайшие визиты'
              description='Сегодня, 14 октября'
              action={
                <Link className={s.textLink} href='/dashboard/bookings'>
                  Все записи <Icon name='up' size={14} />
                </Link>
              }
            />
            {bookings
              .filter(
                b =>
                  b.date === "2026-10-14" &&
                  ["Ожидает", "Подтверждена"].includes(b.status),
              )
              .map(b => {
                const client = clients.find(c => c.id === b.clientId);
                return (
                  <Link
                    href='/dashboard/bookings'
                    key={b.id}
                    className={s.visit}
                  >
                    <span className={s.visitTime}>{b.time}</span>
                    <Avatar name={client?.name || ""} />
                    <div>
                      <strong>{client?.name}</strong>
                      <small>
                        {services.find(v => v.id === b.serviceId)?.name} ·{" "}
                        {team.find(t => t.id === b.workerId)?.name}
                      </small>
                    </div>
                    <Status value={b.status} />
                  </Link>
                );
              })}
          </Card>
        </div>
        <div className={s.right}>
          <BookingSummary />
          <Card>
            <SectionHeader
              title='Загрузка постов'
              action={
                <Link
                  href='/dashboard/workshop'
                  aria-label='Открыть мастерскую'
                >
                  <Icon name='up' size={18} />
                </Link>
              }
            />
            <div className={s.bayCount}>
              <strong>
                {Math.round(
                  (orders.filter(o => o.status !== "Выдан").length /
                    bays.length) *
                    100,
                )}
                %
              </strong>
              <span>
                {orders.filter(o => o.status !== "Выдан").length} из{" "}
                {bays.length} заняты
              </span>
            </div>
            <div className={s.bayProgress}>
              <i
                style={{
                  width: `${(orders.filter(o => o.status !== "Выдан").length / bays.length) * 100}%`,
                }}
              />
            </div>
            {bays.map(b => {
              const order = orders.find(
                o => o.bayId === b.id && o.status !== "Выдан",
              );
              const booking = bookings.find(v => v.id === order?.bookingId);
              return (
                <Link href='/dashboard/workshop' key={b.id} className={s.bay}>
                  <span className={s.bayIcon}>
                    <Icon name='garage' size={19} />
                  </span>
                  <div>
                    <strong>{b.name}</strong>
                    <small>
                      {order
                        ? services.find(v => v.id === booking?.serviceId)?.name
                        : "Готов к записи"}
                    </small>
                  </div>
                  <span className={`${s.bayStatus} ${!order ? s.free : ""}`}>
                    {order ? "Занят" : "Свободен"}
                  </span>
                </Link>
              );
            })}
          </Card>
          <div className={s.insight}>
            <Icon name='lightning' size={22} />
            <div>
              <strong>Клиенты возвращаются</strong>
              <p>
                42% клиентов уже были у вас.
                <br />
                Хороший сервис замечают.
              </p>
            </div>
          </div>
        </div>
      </div>
      <BookingDialog open={newBooking} onClose={() => setNewBooking(false)} />
    </>
  );
}
