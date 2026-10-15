"use client";
import layout from "@/shared/styles/utility.module.scss";
import { useState } from "react";
import { useQueryState } from "@/shared/lib/use-query-state";
import { useDemo } from "@/entities/workspace/model/provider";
import { RecordEditor } from "@/features/record-editor/ui/record-editor";
import { BookingDetails } from "@/features/booking/ui/booking-details";
import {
  Card,
  PageHeader,
  Button,
  Search,
  Avatar,
  Dialog,
  Segmented,
  Empty,
} from "@/shared/ui/controls";
import { money, dateLabel } from "@/shared/lib/format";
import type { Client } from "@/entities/client/model/mock";
import s from "@/shared/styles/screen.module.scss";
export default function Clients() {
  const { clients, setClients, bookings, services, notice } = useDemo();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Все клиенты");
  const [selected, setSelected] = useQueryState("client", "");
  const [editor, setEditor] = useState<Client | "new" | null>(null);
  const [bookingId, setBookingId] = useState("");
  const client = clients.find(c => c.id === selected);
  const filtered = clients.filter(
    c =>
      (filter !== "Постоянные" || c.visits >= 5) &&
      (filter !== "Новые" || c.visits === 1) &&
      `${c.name} ${c.email} ${c.phone} ${c.vehicles.map(v => v.plate).join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        title='Клиенты'
        description='Каждый визит — начало долгих отношений'
        actions={
          <Button icon='plus' onClick={() => setEditor("new")}>
            Добавить клиента
          </Button>
        }
      />
      <div className={s.statRow}>
        {[
          {
            label: "Всего клиентов",
            value: "1 248",
            note: "+96 за этот месяц",
          },
          { label: "Постоянные", value: "524", note: "Больше одного визита" },
          {
            label: "Новые в октябре",
            value: "56",
            note: "Первый визит в сервис",
          },
          { label: "Возвращаются", value: "42%", note: "+6% к сентябрю" },
        ].map(v => (
          <div className={s.stat} key={v.label}>
            <small>{v.label}</small>
            <strong>{v.value}</strong>
            <p>{v.note}</p>
          </div>
        ))}
      </div>
      <Card>
        <div className={s.toolbar}>
          <Segmented
            value={filter}
            onChange={setFilter}
            options={["Все клиенты", "Постоянные", "Новые"].map(v => ({
              value: v,
              label: v,
            }))}
          />
          <Search
            value={search}
            onChange={setSearch}
            placeholder='Имя, телефон или госномер'
          />
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                {[
                  "Клиент",
                  "Телефон",
                  "Автомобиль",
                  "Визиты",
                  "Всего потрачено",
                  "Последний визит",
                ].map(v => (
                  <th key={v}>{v}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr
                  key={c.id}
                  tabIndex={0}
                  onClick={() => setSelected(c.id)}
                  onKeyDown={e => {
                    if (e.key === "Enter") setSelected(c.id);
                  }}
                >
                  <td>
                    <div className={s.person}>
                      <Avatar name={c.name} />
                      <div>
                        <strong>{c.name}</strong>
                        <small>{c.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>{c.phone}</td>
                  <td>{c.vehicles[0]?.name || "—"}</td>
                  <td>{c.visits}</td>
                  <td>{money(c.total)}</td>
                  <td>{c.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && <Empty />}
        <div className={s.pagination}>
          <span>Показано {filtered.length} клиентов</span>
          <span>Демонстрационная база</span>
        </div>
      </Card>
      <Dialog
        open={!!client}
        onClose={() => setSelected("")}
        title='Карточка клиента'
        drawer
      >
        {client && (
          <>
            <div className={s.profileHero}>
              <Avatar size='large' name={client.name} />
              <div>
                <h2>{client.name}</h2>
                <p>
                  {client.visits} визитов · {money(client.total)}
                </p>
              </div>
            </div>
            <div className={s.detailRow}>
              <span>Телефон</span>
              <strong>{client.phone}</strong>
            </div>
            <div className={s.detailRow}>
              <span>Email</span>
              <strong>{client.email}</strong>
            </div>
            <div className={s.detailActions}>
              <Button variant='secondary' onClick={() => setEditor(client)}>
                Редактировать
              </Button>
            </div>
            <h3 className={layout.detailHeading}>Автомобили</h3>
            {client.vehicles.map(v => (
              <div key={v.id} className={s.note}>
                <strong>{v.name}</strong>
                <p>
                  {v.plate} · {v.year} · {v.mileage} км
                </p>
              </div>
            ))}
            <h3 className={layout.detailHeading}>История визитов</h3>
            {bookings
              .filter(b => b.clientId === client.id)
              .map(b => (
                <button
                  key={b.id}
                  className={`${s.appointment} ${layout.marginBottom10}`}
                  onClick={() => setBookingId(b.id)}
                >
                  <strong>
                    {services.find(v => v.id === b.serviceId)?.name}
                  </strong>
                  <small>
                    {dateLabel(b.date)} · {b.time} · {b.status}
                  </small>
                </button>
              ))}
          </>
        )}
      </Dialog>
      {bookingId && (
        <BookingDetails
          bookingId={bookingId}
          onClose={() => setBookingId("")}
        />
      )}{" "}
      {editor && (
        <RecordEditor
          title={editor === "new" ? "Новый клиент" : "Редактировать клиента"}
          fields={[
            {
              key: "name",
              label: "Имя и фамилия",
              value: editor === "new" ? "" : editor.name,
            },
            {
              key: "phone",
              label: "Телефон",
              type: "tel",
              value: editor === "new" ? "" : editor.phone,
            },
            {
              key: "email",
              label: "Email",
              type: "email",
              value: editor === "new" ? "" : editor.email,
            },
          ]}
          onClose={() => setEditor(null)}
          onSave={v => {
            setClients(items =>
              editor === "new"
                ? [
                    ...items,
                    {
                      id: `c${Date.now()}`,
                      name: v.name,
                      phone: v.phone,
                      email: v.email,
                      visits: 0,
                      total: 0,
                      lastVisit: "Нет визитов",
                      vehicles: [],
                    },
                  ]
                : items.map(c => (c.id === editor.id ? { ...c, ...v } : c)),
            );
            notice("Данные клиента сохранены");
          }}
        />
      )}
    </>
  );
}
