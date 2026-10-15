"use client";
import layout from "@/shared/styles/utility.module.scss";
import { useState } from "react";
import { useDemo } from "@/entities/workspace/model/provider";
import { useQueryState } from "@/shared/lib/use-query-state";
import { RecordEditor } from "@/features/record-editor/ui/record-editor";
import {
  Card,
  PageHeader,
  Button,
  Segmented,
  Status,
  Dialog,
  Select,
  Field,
  Empty,
} from "@/shared/ui/controls";
import { Icon } from "@/shared/ui/icon";
import type { RepairOrder, Bay } from "@/entities/workshop/model/mock";
import s from "@/shared/styles/screen.module.scss";
export default function Workshop() {
  const {
    orders,
    setOrders,
    bays,
    setBays,
    bookings,
    clients,
    services,
    notice,
  } = useDemo();
  const [tab, setTab] = useQueryState("tab", "orders");
  const [selected, setSelected] = useState("");
  const [create, setCreate] = useState(false);
  const [newBooking, setNewBooking] = useState("1052");
  const [newBay, setNewBay] = useState("b4");
  const [note, setNote] = useState("");
  const [bayEditor, setBayEditor] = useState<Bay | "new" | null>(null);
  const order = orders.find(o => o.id === selected);
  const update = (patch: Partial<RepairOrder>) => {
    setOrders(items =>
      items.map(o => (o.id === selected ? { ...o, ...patch } : o)),
    );
    notice("Заказ-наряд обновлён");
  };
  const freeBays = bays.filter(
    b => !orders.some(o => o.bayId === b.id && o.status !== "Выдан"),
  );
  const eligible = bookings.filter(
    b =>
      !orders.some(o => o.bookingId === b.id) &&
      !["Отменена", "Не пришёл"].includes(b.status),
  );
  return (
    <>
      <PageHeader
        title='Мастерская'
        description='Работы, автомобили и загрузка постов'
        actions={
          <Button
            icon='plus'
            onClick={() =>
              tab === "orders" ? setCreate(true) : setBayEditor("new")
            }
          >
            {tab === "orders" ? "Новый заказ-наряд" : "Добавить пост"}
          </Button>
        }
      />
      <div className={s.toolbar}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: "orders", label: "Заказ-наряды" },
            { value: "bays", label: "Посты" },
          ]}
        />
        <span className={s.muted}>
          {bays.length - freeBays.length} из {bays.length} постов заняты
        </span>
      </div>
      {tab === "orders" ? (
        <Card>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  {[
                    "Заказ-наряд",
                    "Автомобиль",
                    "Клиент",
                    "Работы",
                    "Пост",
                    "Статус",
                  ].map(v => (
                    <th key={v}>{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => {
                  const b = bookings.find(v => v.id === o.bookingId);
                  const c = clients.find(v => v.id === b?.clientId);
                  return (
                    <tr
                      key={o.id}
                      tabIndex={0}
                      onClick={() => setSelected(o.id)}
                      onKeyDown={e => {
                        if (e.key === "Enter") setSelected(o.id);
                      }}
                    >
                      <td>
                        <strong>№{o.id}</strong>
                      </td>
                      <td>
                        <div className={s.person}>
                          <div>
                            <strong>
                              {
                                c?.vehicles.find(v => v.id === b?.vehicleId)
                                  ?.name
                              }
                            </strong>
                            <small>
                              {
                                c?.vehicles.find(v => v.id === b?.vehicleId)
                                  ?.plate
                              }
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>{c?.name}</td>
                      <td>{services.find(v => v.id === b?.serviceId)?.name}</td>
                      <td>{bays.find(v => v.id === o.bayId)?.name}</td>
                      <td>
                        <Status value={o.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!orders.length && (
            <Empty
              title='Пока нет заказ-нарядов'
              description='Создайте первый заказ-наряд из записи клиента.'
            />
          )}
        </Card>
      ) : (
        <div className={s.grid}>
          {bays.map(b => {
            const current = orders.find(
              o => o.bayId === b.id && o.status !== "Выдан",
            );
            return (
              <Card key={b.id} className={s.bay}>
                <div className={s.row}>
                  <span className={s.iconTile}>
                    <Icon name='garage' size={26} />
                  </span>
                  <Status value={current?.status || "Свободен"} />
                </div>
                <h2 className={s.cardTitle}>{b.name}</h2>
                <p className={s.muted}>{b.description}</p>
                <div className={s.divider} />
                <div className={s.row}>
                  {current ? (
                    <Button
                      variant='ghost'
                      onClick={() => setSelected(current.id)}
                    >
                      Заказ №{current.id}
                    </Button>
                  ) : (
                    <span className={s.muted}>Готов к приёму автомобиля</span>
                  )}
                  <Button
                    variant='ghost'
                    onClick={() => setBayEditor(b)}
                    aria-label={`Редактировать ${b.name}`}
                  >
                    <Icon name='more' />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <Dialog
        open={!!order}
        onClose={() => setSelected("")}
        title={`Заказ-наряд №${order?.id}`}
        drawer
      >
        {order && (
          <>
            <div className={`${s.note} ${layout.marginBottom24}`}>
              Запись №{order.bookingId}
              <br />
              {
                clients.find(
                  c =>
                    c.id ===
                    bookings.find(b => b.id === order.bookingId)?.clientId,
                )?.name
              }
            </div>
            <div className={s.form}>
              <Select
                label='Статус работ'
                value={order.status}
                onChange={v => update({ status: v as RepairOrder["status"] })}
                options={["Принят", "В работе", "Готов", "Выдан"].map(v => ({
                  value: v,
                  label: v,
                }))}
              />
              <Select
                label='Пост'
                value={order.bayId}
                onChange={v => update({ bayId: v })}
                options={bays
                  .filter(
                    b =>
                      b.id === order.bayId || freeBays.some(v => v.id === b.id),
                  )
                  .map(b => ({ value: b.id, label: b.name }))}
              />
              <Field
                label='Заметка по работам'
                defaultValue={order.note}
                onBlur={e => {
                  if (e.target.value !== order.note)
                    update({ note: e.target.value });
                }}
              />
              <Button
                onClick={() => {
                  notice("Заказ-наряд сохранён");
                  setSelected("");
                }}
              >
                Готово
              </Button>
            </div>
          </>
        )}
      </Dialog>
      <Dialog
        open={create}
        onClose={() => setCreate(false)}
        title='Новый заказ-наряд'
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            const booking =
              eligible.find(b => b.id === newBooking) || eligible[0];
            const bay = freeBays.find(b => b.id === newBay) || freeBays[0];
            if (!booking || !bay) return;
            setOrders(items => [
              ...items,
              {
                id: String(Date.now()).slice(-5),
                bookingId: booking.id,
                bayId: bay.id,
                status: "Принят",
                note,
              },
            ]);
            notice("Заказ-наряд создан");
            setCreate(false);
          }}
        >
          <Select
            label='Запись клиента'
            value={
              eligible.some(b => b.id === newBooking)
                ? newBooking
                : eligible[0]?.id || ""
            }
            onChange={setNewBooking}
            options={eligible.map(b => ({
              value: b.id,
              label: `№${b.id} · ${clients.find(c => c.id === b.clientId)?.name}`,
            }))}
          />
          <Select
            label='Свободный пост'
            value={
              freeBays.some(b => b.id === newBay)
                ? newBay
                : freeBays[0]?.id || ""
            }
            onChange={setNewBay}
            options={freeBays.map(b => ({ value: b.id, label: b.name }))}
          />
          <Field
            label='Комментарий к работам'
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          {!freeBays.length && (
            <p className={s.muted}>
              Все посты заняты. Выдайте готовый заказ или добавьте пост.
            </p>
          )}
          <Button type='submit' disabled={!eligible.length || !freeBays.length}>
            Создать заказ-наряд
          </Button>
        </form>
      </Dialog>
      {bayEditor && (
        <RecordEditor
          title={bayEditor === "new" ? "Новый пост" : "Редактировать пост"}
          fields={[
            {
              key: "name",
              label: "Название",
              value: bayEditor === "new" ? "" : bayEditor.name,
            },
            {
              key: "description",
              label: "Описание",
              value: bayEditor === "new" ? "" : bayEditor.description,
            },
          ]}
          onClose={() => setBayEditor(null)}
          onSave={v => {
            setBays(items =>
              bayEditor === "new"
                ? [
                    ...items,
                    {
                      id: `b${Date.now()}`,
                      name: v.name,
                      description: v.description,
                    },
                  ]
                : items.map(b => (b.id === bayEditor.id ? { ...b, ...v } : b)),
            );
            notice("Пост сохранён");
          }}
        />
      )}
    </>
  );
}
