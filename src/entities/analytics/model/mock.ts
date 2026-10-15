export const analyticsMock = {
  revenue: 624000,
  average: 6000,
  clients: 96,
  repeat: 42,
  totalClients: 1248,
  bookings: [
    { name: "Завершены", value: 104, color: "#141416" },
    { name: "Ожидают", value: 12, color: "#a5a5af" },
    { name: "Отменены", value: 8, color: "#c7c7cf" },
    { name: "Не пришли", value: 4, color: "#e7e7ec" },
  ],
  popular: [
    { id: "oil", count: 38, share: 36.5 },
    { id: "diagnostic", count: 29, share: 27.9 },
    { id: "tire", count: 22, share: 21.2 },
  ],
  daily: [32, 39, 44, 38, 52, 65, 47, 57, 44, 62, 53, 69, 42].map(
    (value, index) => ({ day: `${index + 1} окт`, value: value * 1000 }),
  ),
  weekly: [
    { day: "Пн", value: 74000 },
    { day: "Вт", value: 98000 },
    { day: "Ср", value: 65000 },
    { day: "Чт", value: 112000 },
    { day: "Пт", value: 97000 },
    { day: "Сб", value: 123000 },
    { day: "Вс", value: 55000 },
  ],
  monthly: [
    { day: "Май", value: 420000 },
    { day: "Июн", value: 510000 },
    { day: "Июл", value: 480000 },
    { day: "Авг", value: 570000 },
    { day: "Сен", value: 526000 },
    { day: "Окт", value: 624000 },
  ],
};
