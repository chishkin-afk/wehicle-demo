export type BookingStatus =
  | "Ожидает"
  | "Подтверждена"
  | "В работе"
  | "Завершена"
  | "Отменена"
  | "Не пришёл";
export interface Booking {
  id: string;
  clientId: string;
  serviceId: string;
  workerId: string;
  vehicleId: string;
  date: string;
  time: string;
  status: BookingStatus;
  comment: string;
  cancelledBy?: "Клиент" | "Сервис";
}
export const bookingMock: Booking[] = [
  {
    id: "1048",
    clientId: "c1",
    serviceId: "oil",
    workerId: "w1",
    vehicleId: "v1",
    date: "2026-10-14",
    time: "10:00",
    status: "Завершена",
    comment: "Масло клиента",
  },
  {
    id: "1049",
    clientId: "c2",
    serviceId: "diagnostic",
    workerId: "w2",
    vehicleId: "v2",
    date: "2026-10-14",
    time: "11:30",
    status: "Завершена",
    comment: "Проверить ошибку двигателя",
  },
  {
    id: "1050",
    clientId: "c3",
    serviceId: "brake",
    workerId: "w1",
    vehicleId: "v3",
    date: "2026-10-14",
    time: "13:00",
    status: "В работе",
    comment: "Скрип при торможении",
  },
  {
    id: "1051",
    clientId: "c4",
    serviceId: "tire",
    workerId: "w3",
    vehicleId: "v4",
    date: "2026-10-14",
    time: "14:00",
    status: "В работе",
    comment: "Зимние шины в багажнике",
  },
  {
    id: "1052",
    clientId: "c5",
    serviceId: "air",
    workerId: "w1",
    vehicleId: "v5",
    date: "2026-10-14",
    time: "15:30",
    status: "Подтверждена",
    comment: "",
  },
  {
    id: "1053",
    clientId: "c6",
    serviceId: "engine",
    workerId: "w2",
    vehicleId: "v6",
    date: "2026-10-14",
    time: "16:00",
    status: "Ожидает",
    comment: "Стук на неровностях",
  },
  {
    id: "1054",
    clientId: "c1",
    serviceId: "diagnostic",
    workerId: "w2",
    vehicleId: "v1",
    date: "2026-10-15",
    time: "11:00",
    status: "Подтверждена",
    comment: "Проверка перед поездкой",
  },
  {
    id: "1042",
    clientId: "c1",
    serviceId: "tire",
    workerId: "w3",
    vehicleId: "v1",
    date: "2026-10-12",
    time: "12:00",
    status: "Завершена",
    comment: "",
  },
];
