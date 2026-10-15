export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  icon: "oil" | "diagnostic" | "tire" | "brake" | "air" | "engine";
  archived?: boolean;
}
export const serviceMock: Service[] = [
  {
    id: "oil",
    name: "Замена масла",
    description:
      "Замена моторного масла и фильтра. Проверка уровня технических жидкостей.",
    price: 3500,
    duration: 60,
    category: "Обслуживание",
    icon: "oil",
  },
  {
    id: "diagnostic",
    name: "Компьютерная диагностика",
    description:
      "Проверка электронных систем и подробный отчёт о состоянии автомобиля.",
    price: 2500,
    duration: 45,
    category: "Диагностика",
    icon: "diagnostic",
  },
  {
    id: "tire",
    name: "Шиномонтаж",
    description:
      "Сезонная замена четырёх колёс, балансировка и проверка давления.",
    price: 4800,
    duration: 90,
    category: "Обслуживание",
    icon: "tire",
  },
  {
    id: "brake",
    name: "Замена тормозных колодок",
    description: "Замена колодок на одной оси и проверка тормозной системы.",
    price: 4200,
    duration: 90,
    category: "Ремонт",
    icon: "brake",
  },
  {
    id: "air",
    name: "Обслуживание кондиционера",
    description:
      "Диагностика герметичности, очистка системы и заправка хладагентом.",
    price: 5500,
    duration: 60,
    category: "Обслуживание",
    icon: "air",
  },
  {
    id: "engine",
    name: "Диагностика подвески",
    description:
      "Проверка амортизаторов, рычагов и всех элементов ходовой части.",
    price: 1800,
    duration: 30,
    category: "Диагностика",
    icon: "engine",
  },
];
