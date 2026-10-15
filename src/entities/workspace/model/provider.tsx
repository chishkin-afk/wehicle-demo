"use client";
import { bookingMock, type Booking } from "@/entities/booking/@x/workspace";
import { clientMock, type Client } from "@/entities/client/@x/workspace";
import { serviceMock, type Service } from "@/entities/service/@x/workspace";
import { teamMock, type Employee } from "@/entities/team/@x/workspace";
import {
  bayMock,
  orderMock,
  type Bay,
  type RepairOrder,
} from "@/entities/workshop/@x/workspace";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
type State = {
  services: Service[];
  setServices: Dispatch<SetStateAction<Service[]>>;
  clients: Client[];
  setClients: Dispatch<SetStateAction<Client[]>>;
  team: Employee[];
  setTeam: Dispatch<SetStateAction<Employee[]>>;
  bookings: Booking[];
  setBookings: Dispatch<SetStateAction<Booking[]>>;
  bays: Bay[];
  setBays: Dispatch<SetStateAction<Bay[]>>;
  orders: RepairOrder[];
  setOrders: Dispatch<SetStateAction<RepairOrder[]>>;
  notice: (text: string) => void;
  customerId: string;
  setCustomerId: Dispatch<SetStateAction<string>>;
  role: "Владелец" | "Менеджер" | "Мастер";
  setRole: Dispatch<SetStateAction<"Владелец" | "Менеджер" | "Мастер">>;
};
const Context = createContext<State | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState(serviceMock);
  const [clients, setClients] = useState(clientMock);
  const [team, setTeam] = useState(teamMock);
  const [bookings, setBookings] = useState(bookingMock);
  const [bays, setBays] = useState(bayMock);
  const [orders, setOrders] = useState(orderMock);
  const [role, setRole] = useState<State["role"]>("Владелец");
  const [message, setMessage] = useState("");
  const [customerId, setCustomerId] = useState("c1");
  const notice = (text: string) => {
    setMessage(text);
  };
  return (
    <Context.Provider
      value={{
        services,
        setServices,
        clients,
        setClients,
        team,
        setTeam,
        bookings,
        setBookings,
        bays,
        setBays,
        orders,
        setOrders,
        notice,
        role,
        setRole,
        customerId,
        setCustomerId,
      }}
    >
      {children}
      {message && (
        <div className='toast' role='status'>
          <span>{message}</span>
          <button
            aria-label='Закрыть уведомление'
            onClick={() => setMessage("")}
          >
            Закрыть
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error("DemoProvider is required");
  return value;
}
