export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  year: string;
  mileage: string;
}
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
  total: number;
  lastVisit: string;
  vehicles: Vehicle[];
}
export const clientMock: Client[] = [
  {
    id: "c1",
    name: "Александр Морозов",
    email: "alex.morozov@mail.ru",
    phone: "+7 (999) 123-45-67",
    visits: 12,
    total: 68400,
    lastVisit: "12 октября",
    vehicles: [
      {
        id: "v1",
        name: "BMW 320i",
        plate: "А 777 АА 777",
        year: "2021",
        mileage: "42 800",
      },
    ],
  },
  {
    id: "c2",
    name: "Мария Волкова",
    email: "m.volkova@mail.ru",
    phone: "+7 (916) 234-56-78",
    visits: 8,
    total: 43200,
    lastVisit: "11 октября",
    vehicles: [
      {
        id: "v2",
        name: "Audi A4",
        plate: "М 234 КО 197",
        year: "2020",
        mileage: "58 100",
      },
    ],
  },
  {
    id: "c3",
    name: "Дмитрий Соколов",
    email: "d.sokolov@mail.ru",
    phone: "+7 (925) 345-67-89",
    visits: 5,
    total: 28100,
    lastVisit: "10 октября",
    vehicles: [
      {
        id: "v3",
        name: "Mercedes-Benz C 200",
        plate: "С 456 МР 799",
        year: "2022",
        mileage: "31 400",
      },
    ],
  },
  {
    id: "c4",
    name: "Елена Новикова",
    email: "e.novikova@mail.ru",
    phone: "+7 (903) 456-78-90",
    visits: 3,
    total: 15400,
    lastVisit: "9 октября",
    vehicles: [
      {
        id: "v4",
        name: "Volkswagen Golf",
        plate: "Е 890 НВ 750",
        year: "2019",
        mileage: "67 000",
      },
    ],
  },
  {
    id: "c5",
    name: "Артём Козлов",
    email: "a.kozlov@mail.ru",
    phone: "+7 (926) 567-89-01",
    visits: 1,
    total: 5500,
    lastVisit: "8 октября",
    vehicles: [
      {
        id: "v5",
        name: "Kia K5",
        plate: "К 123 АТ 777",
        year: "2023",
        mileage: "18 900",
      },
    ],
  },
  {
    id: "c6",
    name: "Анна Смирнова",
    email: "a.smirnova@mail.ru",
    phone: "+7 (985) 678-90-12",
    visits: 7,
    total: 36800,
    lastVisit: "7 октября",
    vehicles: [
      {
        id: "v6",
        name: "Volvo XC60",
        plate: "В 321 СА 799",
        year: "2021",
        mileage: "45 600",
      },
    ],
  },
];
