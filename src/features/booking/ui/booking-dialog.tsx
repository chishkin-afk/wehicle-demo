"use client";
import type { Booking } from "@/entities/booking/model/mock";
import { useDemo } from "@/entities/workspace/model/provider";
import s from "@/shared/styles/screen.module.scss";
import { Button, Dialog, Field, Select } from "@/shared/ui/controls";
import { useState } from "react";
import { isAvailable, slots } from "../model/availability";
export function BookingDialog({
  open,
  onClose,
  booking,
  customer = false,
}: {
  open: boolean;
  onClose: () => void;
  booking?: Booking;
  customer?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={booking ? "Перенести запись" : "Новая запись"}
    >
      {open && (
        <BookingForm
          key={booking?.id || "new"}
          onClose={onClose}
          booking={booking}
          customer={customer}
        />
      )}
    </Dialog>
  );
}
function BookingForm({
  onClose,
  booking,
  customer = false,
}: {
  onClose: () => void;
  booking?: Booking;
  customer?: boolean;
}) {
  const { clients, services, team, bookings, setBookings, notice } = useDemo();
  const [clientId, setClientId] = useState(booking?.clientId || "c1");
  const [serviceId, setServiceId] = useState(booking?.serviceId || "oil");
  const [workerId, setWorkerId] = useState(booking?.workerId || "w1");
  const [date, setDate] = useState(booking?.date || "2026-10-15");
  const [time, setTime] = useState("");
  const [comment, setComment] = useState(booking?.comment || "");
  const service = services.find(s => s.id === serviceId)!;
  const workers = team.filter(
    t => t.status === "Работает" && t.serviceIds.includes(serviceId),
  );
  const worker = workers.find(w => w.id === workerId) || workers[0];
  const available = worker
    ? slots.filter(t =>
        isAvailable(
          t,
          date,
          worker.id,
          service,
          bookings,
          services,
          booking?.id,
          worker.shift,
        ),
      )
    : [];
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (!available.includes(time) || !worker) return;
        const record: Booking = {
          id: booking?.id || String(Date.now()),
          clientId,
          serviceId,
          workerId: worker.id,
          vehicleId:
            booking?.vehicleId ||
            clients.find(c => c.id === clientId)?.vehicles[0]?.id ||
            "",
          date,
          time,
          status: "Подтверждена",
          comment,
        };
        setBookings(b =>
          booking
            ? b.map(v => (v.id === booking.id ? record : v))
            : [record, ...b],
        );
        notice(booking ? "Запись перенесена" : "Новая запись добавлена");
        onClose();
      }}
    >
      <Select
        label='Клиент'
        value={clientId}
        onChange={setClientId}
        options={clients
          .filter(c => !customer || c.id === booking?.clientId)
          .map(c => ({ value: c.id, label: c.name }))}
      />
      <Select
        label='Услуга'
        value={serviceId}
        onChange={v => {
          setServiceId(v);
          setTime("");
        }}
        options={services
          .filter(s => !s.archived)
          .map(s => ({ value: s.id, label: s.name }))}
      />
      <Select
        label='Мастер'
        value={worker?.id || ""}
        onChange={v => {
          setWorkerId(v);
          setTime("");
        }}
        options={workers.map(w => ({ value: w.id, label: w.name }))}
      />
      <div className={s.formGrid}>
        <Field
          label='Дата'
          type='date'
          value={date}
          min='2026-10-14'
          onChange={e => {
            setDate(e.target.value);
            setTime("");
          }}
          required
        />
        <Select
          label='Свободное время'
          value={time}
          onChange={setTime}
          options={[
            {
              value: "",
              label: available.length
                ? "Выберите время"
                : "Нет свободного времени",
            },
            ...available.map(t => ({ value: t, label: t })),
          ]}
        />
      </div>
      <Field
        label='Комментарий'
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <Button type='submit' disabled={!time || !worker}>
        Сохранить запись
      </Button>
    </form>
  );
}
