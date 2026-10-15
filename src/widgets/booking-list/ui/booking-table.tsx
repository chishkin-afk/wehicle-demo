"use client";
import layout from "@/shared/styles/utility.module.scss";
import { useDemo } from "@/entities/workspace/model/provider";
import { Avatar, Status, Empty } from "@/shared/ui/controls";
import { money, dateLabel } from "@/shared/lib/format";
import type { Booking } from "@/entities/booking/model/mock";
import s from "@/shared/styles/screen.module.scss";
export function BookingTable({
  bookings,
  onSelect,
}: {
  bookings: Booking[];
  onSelect: (id: string) => void;
}) {
  const { clients, services, team } = useDemo();
  if (!bookings.length) return <Empty />;
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>
            {[
              "Дата и время",
              "Клиент",
              "Услуга / автомобиль",
              "Мастер",
              "Стоимость",
              "Статус",
            ].map(t => (
              <th key={t} scope='col'>
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => {
            const client = clients.find(c => c.id === b.clientId);
            const service = services.find(v => v.id === b.serviceId);
            return (
              <tr
                key={b.id}
                tabIndex={0}
                onClick={() => onSelect(b.id)}
                onKeyDown={e => {
                  if (e.key === "Enter") onSelect(b.id);
                }}
              >
                <td>
                  <strong>{b.time}</strong>
                  <small className={`${s.muted} ${layout.tableSubtext}`}>
                    {dateLabel(b.date)}
                  </small>
                </td>
                <td>
                  <div className={s.person}>
                    <Avatar name={client?.name || ""} />
                    <div>
                      <strong>{client?.name}</strong>
                      <small>{client?.phone}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={s.person}>
                    <div>
                      <strong>{service?.name}</strong>
                      <small>
                        {client?.vehicles.find(v => v.id === b.vehicleId)?.name}
                      </small>
                    </div>
                  </div>
                </td>
                <td>{team.find(t => t.id === b.workerId)?.name}</td>
                <td>{money(service?.price || 0)}</td>
                <td>
                  <Status value={b.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
