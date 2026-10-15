"use client";
import layout from "@/shared/styles/utility.module.scss";
import type { Booking } from "@/entities/booking/model/mock";
import { useDemo } from "@/entities/workspace/model/provider";
import { dateLabel, money } from "@/shared/lib/format";
import s from "@/shared/styles/screen.module.scss";
import { Avatar, Button, Dialog, Field, Status } from "@/shared/ui/controls";
import { useState } from "react";
import { BookingDialog } from "./booking-dialog";
export function BookingDetails({
  bookingId,
  onClose,
  customer = false,
}: {
  bookingId: string;
  onClose: () => void;
  customer?: boolean;
}) {
  const { bookings, setBookings, services, clients, team, notice } = useDemo();
  const [reschedule, setReschedule] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [reason, setReason] = useState("");
  const b = bookings.find(v => v.id === bookingId);
  if (!b) return null;
  const client = clients.find(c => c.id === b.clientId);
  const service = services.find(v => v.id === b.serviceId);
  const vehicle = client?.vehicles.find(v => v.id === b.vehicleId);
  const update = (status: Booking["status"]) => {
    setBookings(items =>
      items.map(v =>
        v.id === b.id
          ? {
              ...v,
              status,
              cancelledBy:
                status === "Отменена"
                  ? customer
                    ? "Клиент"
                    : "Сервис"
                  : v.cancelledBy,
              comment:
                status === "Отменена" && reason
                  ? `${v.comment} Причина отмены: ${reason}`
                  : v.comment,
            }
          : v,
      ),
    );
    notice(`Запись №${b.id}: ${status.toLowerCase()}`);
  };
  return (
    <>
      <Dialog open onClose={onClose} title={`Запись №${b.id}`} drawer>
        <div className={s.profileHero}>
          <Avatar name={client?.name || ""} size='large' />
          <div>
            <h2>{service?.name}</h2>
            <p>{client?.name}</p>
          </div>
        </div>
        <Status value={b.status} />
        {[
          ["Дата", dateLabel(b.date)],
          ["Время", b.time],
          ["Мастер", team.find(t => t.id === b.workerId)?.name],
          ["Автомобиль", vehicle?.name],
          ["Госномер", vehicle?.plate],
          ["Телефон", client?.phone],
          ["Стоимость", money(service?.price || 0)],
          ["Длительность", `${service?.duration} мин`],
        ].map(([label, value]) => (
          <div key={label} className={s.detailRow}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
        {b.comment && (
          <div className={`${s.note} ${layout.marginTop20}`}>{b.comment}</div>
        )}
        {b.cancelledBy && (
          <p className={`${s.muted} ${layout.marginTop16}`}>
            Инициатор отмены: {b.cancelledBy}
          </p>
        )}
        <div className={s.detailActions}>
          {!["Завершена", "Отменена", "Не пришёл"].includes(b.status) && (
            <>
              <Button variant='secondary' onClick={() => setReschedule(true)}>
                Перенести
              </Button>
              {!customer && (
                <Button onClick={() => update("Завершена")}>Завершить</Button>
              )}
              <Button variant='danger' onClick={() => setConfirmCancel(true)}>
                Отменить запись
              </Button>
              {!customer && (
                <Button variant='ghost' onClick={() => update("Не пришёл")}>
                  Не пришёл
                </Button>
              )}
            </>
          )}
        </div>
      </Dialog>
      <BookingDialog
        open={reschedule}
        onClose={() => setReschedule(false)}
        booking={b}
        customer={customer}
      />
      <Dialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title='Отменить запись?'
      >
        <p className={`${s.muted} ${layout.marginBottom20}`}>
          Выбранное время снова станет доступным для записи.
        </p>
        <Field
          label='Причина отмены'
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
        <div className={s.detailActions}>
          <Button variant='secondary' onClick={() => setConfirmCancel(false)}>
            Оставить запись
          </Button>
          <Button
            variant='danger'
            onClick={() => {
              update("Отменена");
              setConfirmCancel(false);
            }}
          >
            Да, отменить
          </Button>
        </div>
      </Dialog>
    </>
  );
}
