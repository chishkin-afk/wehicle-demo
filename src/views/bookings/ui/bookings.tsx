"use client";
import layout from "@/shared/styles/utility.module.scss";
import { useState } from "react";
import { useDemo } from "@/entities/workspace/model/provider";
import { useQueryState } from "@/shared/lib/use-query-state";
import { BookingDialog } from "@/features/booking/ui/booking-dialog";
import { BookingDetails } from "@/features/booking/ui/booking-details";
import { BookingTable } from "@/widgets/booking-list/ui/booking-table";
import {
  Card,
  PageHeader,
  Button,
  Segmented,
  Search,
  IconButton,
  Empty,
} from "@/shared/ui/controls";
import { dateLabel } from "@/shared/lib/format";
import s from "@/shared/styles/screen.module.scss";
export default function Bookings() {
  const { bookings, clients, services, team, role } = useDemo();
  const [view, setView] = useQueryState("view", "calendar");
  const [status, setStatus] = useQueryState("status", "Все статусы");
  const [selected, setSelected] = useQueryState("booking", "");
  const [search, setSearch] = useState("");
  const [worker, setWorker] = useState("all");
  const [date, setDate] = useState("2026-10-14");
  const [period, setPeriod] = useState("day");
  const [create, setCreate] = useState(false);
  const filtered = bookings.filter(
    b =>
      (role !== "Мастер" || b.workerId === "w1") &&
      (worker === "all" || b.workerId === worker) &&
      (status === "Все статусы" || status === b.status) &&
      `${clients.find(c => c.id === b.clientId)?.name} ${clients.find(c => c.id === b.clientId)?.phone} ${services.find(v => v.id === b.serviceId)?.name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const changeDate = (offset: number) => {
    const d = new Date(date + "T12:00:00");
    d.setDate(d.getDate() + offset);
    setDate(d.toISOString().slice(0, 10));
  };
  const workers = team.filter(
    t =>
      t.role === "Мастер" &&
      t.status === "Работает" &&
      (worker === "all" || t.id === worker) &&
      (role !== "Мастер" || t.id === "w1"),
  );
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(date + "T12:00:00");
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
  const headers =
    period === "day"
      ? workers.map(w => ({ id: w.id, label: w.name }))
      : days.map(d => ({ id: d, label: dateLabel(d) }));
  return (
    <>
      <PageHeader
        title='Записи'
        description='Расписание сервиса и каждый визит в деталях'
        actions={
          <Button icon='plus' onClick={() => setCreate(true)}>
            Новая запись
          </Button>
        }
      />
      <Card>
        <div className={s.toolbar}>
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: "calendar", label: "Календарь" },
              { value: "list", label: "Таблица" },
            ]}
          />
          <div className={s.filters}>
            <select
              aria-label='Фильтр по мастеру'
              value={worker}
              onChange={e => setWorker(e.target.value)}
              className={s.chip}
            >
              <option value='all'>Все мастера</option>
              {team
                .filter(t => t.role === "Мастер")
                .map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
            <select
              aria-label='Фильтр по статусу'
              className={s.chip}
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              {[
                "Все статусы",
                "Ожидает",
                "Подтверждена",
                "В работе",
                "Завершена",
                "Отменена",
                "Не пришёл",
              ].map(v => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <Search
              value={search}
              onChange={setSearch}
              placeholder='Найти запись'
            />
          </div>
        </div>
        {view === "list" ? (
          <BookingTable bookings={filtered} onSelect={setSelected} />
        ) : (
          <>
            <div className={s.toolbar}>
              <div className={s.filters}>
                <IconButton
                  name='previous'
                  label='Предыдущий день'
                  onClick={() => changeDate(period === "day" ? -1 : -7)}
                />
                <strong className={layout.calendarDate}>{dateLabel(date)} 2026</strong>
                <IconButton
                  name='next'
                  label='Следующий день'
                  onClick={() => changeDate(period === "day" ? 1 : 7)}
                />
                <Button variant='ghost' onClick={() => setDate("2026-10-14")}>
                  Сегодня
                </Button>
              </div>
              <Segmented
                value={period}
                onChange={setPeriod}
                options={[
                  { value: "day", label: "День" },
                  { value: "week", label: "Неделя" },
                ]}
              />
            </div>
            <div className={s.tableWrap}>
              {headers.length ? (
                <div
                  className={s.calendar}
                  style={{
                    gridTemplateColumns: `65px repeat(${headers.length}, minmax(${period === "week" ? 110 : 150}px,1fr))`,
                  }}
                >
                  <div className={s.calendarHead} />
                  {headers.map(h => (
                    <div className={s.calendarHead} key={h.id}>
                      {h.label}
                    </div>
                  ))}
                  {[
                    "09:00",
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                  ].map(time => (
                    <CalendarRow
                      key={time}
                      time={time}
                      cells={headers.map(h => ({
                        id: h.id,
                        items: filtered.filter(
                          b =>
                            (period === "day"
                              ? b.date === date && b.workerId === h.id
                              : b.date === h.id) &&
                            b.time.slice(0, 2) === time.slice(0, 2),
                        ),
                      }))}
                      onSelect={setSelected}
                      clients={clients}
                      services={services}
                    />
                  ))}
                </div>
              ) : (
                <Empty
                  title='Нет доступных мастеров'
                  description='Измените фильтр или откройте таблицу записей.'
                />
              )}
            </div>
          </>
        )}
        <div className={s.pagination}>
          <span>{filtered.length} записей в выбранных фильтрах</span>
          <span>Москва · UTC+3</span>
        </div>
      </Card>
      <BookingDialog open={create} onClose={() => setCreate(false)} />
      {selected && (
        <BookingDetails bookingId={selected} onClose={() => setSelected("")} />
      )}
    </>
  );
}
function CalendarRow({
  time,
  cells,
  onSelect,
  clients,
  services,
}: {
  time: string;
  cells: { id: string; items: ReturnType<typeof useDemo>["bookings"] }[];
  onSelect: (id: string) => void;
  clients: ReturnType<typeof useDemo>["clients"];
  services: ReturnType<typeof useDemo>["services"];
}) {
  return (
    <>
      <div className={s.calendarTime}>{time}</div>
      {cells.map(c => (
        <div className={s.calendarCell} key={c.id}>
          {c.items.map(b => (
            <button
              key={b.id}
              className={s.appointment}
              onClick={() => onSelect(b.id)}
            >
              <small>
                {b.time} · {b.status}
              </small>
              <strong>{services.find(v => v.id === b.serviceId)?.name}</strong>
              <small>{clients.find(v => v.id === b.clientId)?.name}</small>
            </button>
          ))}
        </div>
      ))}
    </>
  );
}
