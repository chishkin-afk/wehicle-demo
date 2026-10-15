export const money = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value) + " ₽";
export const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map(p => p[0])
    .join("");
export const dateLabel = (value: string) =>
  new Date(value + "T12:00:00").toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
