import type { Booking } from "@/entities/booking/model/mock";
import type { Service } from "@/entities/service/model/mock";
export const slots = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];
const minutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};
export function isAvailable(
  time: string,
  date: string,
  workerId: string,
  service: Service,
  bookings: Booking[],
  services: Service[],
  excludeId?: string,
  shift = "09:00–18:00",
) {
  const day = new Date(date + "T12:00:00").getDay();
  if (day === 0 || day === 6) return false;
  const [opens, closes] = shift.split("–");
  const start = minutes(time),
    end = start + service.duration;
  if (
    start < minutes(opens) ||
    end > minutes(closes) ||
    (start < 13 * 60 && end > 12 * 60)
  )
    return false;
  return !bookings.some(
    b =>
      b.id !== excludeId &&
      b.date === date &&
      b.workerId === workerId &&
      !["Отменена", "Не пришёл"].includes(b.status) &&
      start <
        minutes(b.time) +
          (services.find(s => s.id === b.serviceId)?.duration || 60) &&
      end > minutes(b.time),
  );
}
