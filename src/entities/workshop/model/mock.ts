export interface Bay {
  id: string;
  name: string;
  description: string;
}
export interface RepairOrder {
  id: string;
  bookingId: string;
  bayId: string;
  status: "Принят" | "В работе" | "Готов" | "Выдан";
  note: string;
}
export const bayMock: Bay[] = [
  { id: "b1", name: "Пост 01", description: "Обслуживание и ремонт" },
  { id: "b2", name: "Пост 02", description: "Диагностика" },
  { id: "b3", name: "Пост 03", description: "Шиномонтаж" },
  { id: "b4", name: "Пост 04", description: "Обслуживание и ремонт" },
];
export const orderMock: RepairOrder[] = [
  {
    id: "0241",
    bookingId: "1050",
    bayId: "b1",
    status: "В работе",
    note: "Замена передних колодок",
  },
  {
    id: "0242",
    bookingId: "1049",
    bayId: "b2",
    status: "Готов",
    note: "Диагностика завершена",
  },
  {
    id: "0243",
    bookingId: "1051",
    bayId: "b3",
    status: "В работе",
    note: "Балансировка колёс",
  },
];
