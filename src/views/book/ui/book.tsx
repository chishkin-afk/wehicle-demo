"use client";
import { isAvailable, slots } from "@/features/booking/model/availability";
import { useDemo } from "@/entities/workspace/model/provider";
import { dateLabel, money } from "@/shared/lib/format";
import {
  Avatar,
  Button,
  Card,
  Field,
  LinkButton,
  Select,
} from "@/shared/ui/controls";
import { Icon } from "@/shared/ui/icon";
import { PublicHeader } from "@/widgets/public-header/ui/header";
import Link from "@/shared/ui/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import s from "./book.module.scss";
export default function Book() {
  const params = useSearchParams();
  const {
    services,
    team,
    bookings,
    setBookings,
    clients,
    setClients,
    notice,
    customerId,
    setCustomerId,
  } = useDemo();
  const activeServices = services.filter(s => !s.archived);
  const [serviceId, setServiceId] = useState(params.get("service") || "oil");
  const service =
    activeServices.find(s => s.id === serviceId) || activeServices[0];
  const [workerId, setWorkerId] = useState("");
  const workers = team.filter(
    t => t.status === "Работает" && t.serviceIds.includes(service.id),
  );
  const worker = workers.find(w => w.id === workerId) || workers[0];
  const [date, setDate] = useState("2026-10-15");
  const [time, setTime] = useState("");
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const client = clients.find(c => c.id === customerId) || clients[0];
  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone);
  const [email, setEmail] = useState(client.email);
  const [code, setCode] = useState("");
  const [comment, setComment] = useState("");
  const [vehicleId, setVehicleId] = useState(client.vehicles[0]?.id || "new");
  const [car, setCar] = useState("");
  const [plate, setPlate] = useState("");
  const [error, setError] = useState("");
  const days = Array.from({ length: 7 }, (_, i) => `2026-10-${15 + i}`);
  const available = worker
    ? slots.filter(t =>
        isAvailable(
          t,
          date,
          worker.id,
          service,
          bookings,
          services,
          undefined,
          worker.shift,
        ),
      )
    : [];
  const confirm = () => {
    if (code !== "123456") {
      setError("Введите демонстрационный код 123456.");
      return;
    }
    if (!worker || !available.includes(time)) {
      setError("Выберите свободное время.");
      setStep(2);
      return;
    }
    let current = clients.find(
      c => c.email.toLowerCase() === email.toLowerCase(),
    );
    const selectedVehicle = client.vehicles.find(v => v.id === vehicleId);
    const vehicle =
      vehicleId === "new"
        ? { id: `v${Date.now()}`, name: car, plate, year: "2026", mileage: "0" }
        : selectedVehicle!;
    if (!current) {
      current = {
        id: `c${Date.now()}`,
        name,
        email,
        phone,
        visits: 0,
        total: 0,
        lastVisit: "Нет визитов",
        vehicles: [vehicle],
      };
      setClients(items => [...items, current!]);
    } else {
      setClients(items =>
        items.map(c =>
          c.id === current!.id
            ? {
                ...c,
                name,
                phone,
                vehicles:
                  vehicleId === "new" ? [...c.vehicles, vehicle] : c.vehicles,
              }
            : c,
        ),
      );
    }
    setCustomerId(current.id);
    setBookings(items => [
      ...items,
      {
        id: String(Date.now()).slice(-6),
        clientId: current!.id,
        serviceId: service.id,
        workerId: worker.id,
        vehicleId: vehicle.id,
        date,
        time,
        status: "Подтверждена",
        comment,
      },
    ]);
    setDone(true);
  };
  return (
    <>
      <PublicHeader />
      <main className={`${s.main} page-enter`}>
        {done ? (
          <Card className={s.success}>
            <span>
              <Icon name='success' size={50} weight='light' />
            </span>
            <h1>Вы записаны.</h1>
            <p>
              Будем ждать вас {dateLabel(date)} в {time}.<br />
              {service.name} · {worker?.name}
            </p>
            <div className={s.successInfo}>
              <Icon name='pin' size={19} /> Москва, ул. Автозаводская, 23
            </div>
            <LinkButton href='/account'>Перейти в личный кабинет</LinkButton>
            <Link href='/'>На главную</Link>
          </Card>
        ) : (
          <>
            <Link href='/' className={s.back}>
              <Icon name='left' size={16} /> На главную
            </Link>
            <div className={s.title}>
              <h1>Найдём время для вашего автомобиля.</h1>
              <p>Несколько простых шагов — и визит запланирован.</p>
            </div>
            <div className={s.layout}>
              <div>
                <div className={s.steps}>
                  {["Услуга", "Мастер", "Дата и время", "Подтверждение"].map(
                    (label, i) => (
                      <button
                        key={label}
                        disabled={i > step}
                        aria-current={i === step ? "step" : undefined}
                        className={
                          i === step ? s.current : i < step ? s.completed : ""
                        }
                        onClick={() => setStep(i)}
                      >
                        <span>
                          {i < step ? <Icon name='check' size={14} /> : i + 1}
                        </span>
                        {label}
                      </button>
                    ),
                  )}
                </div>
                <Card className={s.stepCard}>
                  <h2>
                    {
                      [
                        "Что нужно сделать?",
                        "Кому доверим автомобиль?",
                        "Когда вам удобно?",
                        "Всё почти готово.",
                      ][step]
                    }
                  </h2>
                  <p className={s.stepDescription}>
                    {
                      [
                        "Выберите услугу для вашего автомобиля.",
                        "Все наши мастера знают своё дело.",
                        "Показываем только свободное время.",
                        "Проверьте контакты и подтвердите запись.",
                      ][step]
                    }
                  </p>
                  {step === 0 ? (
                    <div className={s.options}>
                      {activeServices.map(v => (
                        <button
                          key={v.id}
                          className={`${s.serviceOption} ${service.id === v.id ? s.selected : ""}`}
                          onClick={() => {
                            setServiceId(v.id);
                            setWorkerId("");
                            setTime("");
                          }}
                        >
                          <span className={s.optionIcon}>
                            <Icon name={v.icon} size={24} />
                          </span>
                          <span>
                            <strong>{v.name}</strong>
                            <small>{v.duration} мин</small>
                          </span>
                          <b>{money(v.price)}</b>
                          <span className={s.radio}>
                            {service.id === v.id && (
                              <Icon name='check' size={12} />
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : step === 1 ? (
                    <div className={s.options}>
                      {workers.map(w => (
                        <button
                          key={w.id}
                          className={`${s.serviceOption} ${worker?.id === w.id ? s.selected : ""}`}
                          onClick={() => {
                            setWorkerId(w.id);
                            setTime("");
                          }}
                        >
                          <Avatar name={w.name} size='large' />
                          <span>
                            <strong>{w.name}</strong>
                            <small>{w.speciality}</small>
                          </span>
                          <span className={s.radio}>
                            {worker?.id === w.id && (
                              <Icon name='check' size={12} />
                            )}
                          </span>
                        </button>
                      ))}
                      {!workers.length && (
                        <p className={s.stepDescription}>
                          Для этой услуги пока нет доступного мастера. Выберите
                          другую услугу.
                        </p>
                      )}
                    </div>
                  ) : step === 2 ? (
                    <>
                      <div className={s.month}>
                        <strong>Октябрь 2026</strong>
                        <span>Москва · UTC+3</span>
                      </div>
                      <div className={s.days}>
                        {days.map(d => (
                          <button
                            key={d}
                            className={date === d ? s.selected : ""}
                            onClick={() => {
                              setDate(d);
                              setTime("");
                            }}
                          >
                            <small>
                              {new Date(d + "T12:00:00").toLocaleDateString(
                                "ru-RU",
                                { weekday: "short" },
                              )}
                            </small>
                            <strong>{d.slice(-2)}</strong>
                          </button>
                        ))}
                      </div>
                      <h3 className={s.timeHeading}>Свободное время</h3>
                      <div className={s.times}>
                        {slots.map(t => (
                          <button
                            key={t}
                            disabled={!available.includes(t)}
                            className={time === t ? s.selected : ""}
                            onClick={() => setTime(t)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <p className={s.slotNote}>
                        <Icon name='clock' size={15} /> Визит займёт{" "}
                        {service.duration} мин
                      </p>
                    </>
                  ) : (
                    <form
                      id='booking-confirm'
                      className={s.form}
                      onSubmit={e => {
                        e.preventDefault();
                        confirm();
                      }}
                    >
                      <div className={s.mobileReview}>
                        <strong>{service.name}</strong>
                        <span>
                          {dateLabel(date)}, {time} · {worker?.name}
                        </span>
                        <b>{money(service.price)}</b>
                      </div>
                      <Field
                        label='Имя и фамилия'
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                      <div className={s.formGrid}>
                        <Field
                          label='Телефон'
                          type='tel'
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          required
                        />
                        <Field
                          label='Email'
                          type='email'
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Select
                        label='Автомобиль'
                        value={vehicleId}
                        onChange={setVehicleId}
                        options={[
                          ...client.vehicles.map(v => ({
                            value: v.id,
                            label: `${v.name} · ${v.plate}`,
                          })),
                          { value: "new", label: "Добавить автомобиль" },
                        ]}
                      />
                      {vehicleId === "new" && (
                        <div className={s.formGrid}>
                          <Field
                            label='Марка и модель'
                            value={car}
                            onChange={e => setCar(e.target.value)}
                            required
                          />
                          <Field
                            label='Госномер'
                            value={plate}
                            onChange={e => setPlate(e.target.value)}
                            required
                          />
                        </div>
                      )}
                      <Field
                        label='Комментарий к визиту'
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                      />
                      <Field
                        label='Код из почты'
                        inputMode='numeric'
                        maxLength={6}
                        value={code}
                        onChange={e => {
                          setCode(e.target.value);
                          setError("");
                        }}
                        placeholder='В демо используйте 123456'
                        required
                      />
                      <p className={s.slotNote}>
                        Демо: письма не отправляются. Код подтверждения —
                        123456.
                      </p>
                      {error && (
                        <p className={s.error} role='alert'>
                          {error}
                        </p>
                      )}
                    </form>
                  )}
                  <div className={s.stepActions}>
                    {step > 0 && (
                      <Button
                        variant='secondary'
                        icon='left'
                        onClick={() => setStep(step - 1)}
                      >
                        Назад
                      </Button>
                    )}
                    {step < 3 ? (
                      <Button
                        onClick={() => setStep(step + 1)}
                        disabled={
                          (step === 1 && !worker) || (step === 2 && !time)
                        }
                      >
                        Продолжить <Icon name='right' size={16} />
                      </Button>
                    ) : (
                      <Button form='booking-confirm' type='submit' icon='check'>
                        Подтвердить запись
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
              <aside className={s.aside}>
                <Card dark className={s.summary}>
                  <Icon name='car' size={30} weight='light' />
                  <h2>Ваш визит</h2>
                  <div>
                    <span>Услуга</span>
                    <strong>{service.name}</strong>
                  </div>
                  <div>
                    <span>Мастер</span>
                    <strong>
                      {step > 0
                        ? worker?.name || "Не выбран"
                        : "Выберите на следующем шаге"}
                    </strong>
                  </div>
                  <div>
                    <span>Дата и время</span>
                    <strong>
                      {time
                        ? `${dateLabel(date)}, ${time}`
                        : "Выберите удобное время"}
                    </strong>
                  </div>
                  <div className={s.summaryTotal}>
                    <span>Стоимость работ</span>
                    <b>{money(service.price)}</b>
                  </div>
                  <small>Расходные материалы оплачиваются отдельно.</small>
                </Card>
                <div className={s.help}>
                  <Icon name='shield' size={20} />
                  <p>
                    Планы изменились?
                    <br />
                    Перенести запись можно в личном кабинете.
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </>
  );
}
