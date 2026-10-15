export interface Employee {
  id: string;
  name: string;
  role: "Мастер" | "Менеджер" | "Владелец";
  speciality: string;
  email: string;
  status: "Работает" | "В отпуске" | "Приглашён" | "Уволен";
  serviceIds: string[];
  shift: string;
}
export const teamMock: Employee[] = [
  {
    id: "w1",
    name: "Михаил Орлов",
    role: "Мастер",
    speciality: "Техническое обслуживание",
    email: "m.orlov@wehicle.ru",
    status: "Работает",
    serviceIds: ["oil", "air", "brake"],
    shift: "09:00–18:00",
  },
  {
    id: "w2",
    name: "Андрей Лебедев",
    role: "Мастер",
    speciality: "Диагностика и ремонт",
    email: "a.lebedev@wehicle.ru",
    status: "Работает",
    serviceIds: ["diagnostic", "engine", "brake"],
    shift: "10:00–19:00",
  },
  {
    id: "w3",
    name: "Сергей Белов",
    role: "Мастер",
    speciality: "Шиномонтаж",
    email: "s.belov@wehicle.ru",
    status: "Работает",
    serviceIds: ["tire", "oil"],
    shift: "09:00–18:00",
  },
  {
    id: "w4",
    name: "Иван Петров",
    role: "Мастер",
    speciality: "Диагностика",
    email: "i.petrov@wehicle.ru",
    status: "В отпуске",
    serviceIds: ["diagnostic", "engine"],
    shift: "09:00–18:00",
  },
  {
    id: "w5",
    name: "Ольга Крылова",
    role: "Менеджер",
    speciality: "Клиенты и записи",
    email: "o.krylova@wehicle.ru",
    status: "Работает",
    serviceIds: [],
    shift: "09:00–18:00",
  },
];
