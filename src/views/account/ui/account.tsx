"use client";
import layout from "@/shared/styles/utility.module.scss";
import { useState } from "react";
import Link from "@/shared/ui/link";
import { PublicHeader } from "@/widgets/public-header/ui/header";
import { useDemo } from "@/entities/workspace/model/provider";
import { useQueryState } from "@/shared/lib/use-query-state";
import { BookingDetails } from "@/features/booking/ui/booking-details";
import { RecordEditor } from "@/features/record-editor/ui/record-editor";
import {
  Card,
  PageHeader,
  Button,
  LinkButton,
  Avatar,
  Segmented,
  Status,
  Field,
  Toggle,
  Empty,
} from "@/shared/ui/controls";
import { Icon } from "@/shared/ui/icon";
import { money, dateLabel } from "@/shared/lib/format";
import type { Vehicle } from "@/entities/client/model/mock";
import s from "./account.module.scss";
import u from "@/shared/styles/screen.module.scss";
export default function Account() {
  const { clients, setClients, customerId, bookings, services, team, notice } =
    useDemo();
  const client = clients.find(c => c.id === customerId) || clients[0];
  const [tab, setTab] = useQueryState("tab", "bookings");
  const [selected, setSelected] = useQueryState("booking", "");
  const [vehicleEditor, setVehicleEditor] = useState<Vehicle | "new" | null>(
    null,
  );
  const [telegram, setTelegram] = useState(false);
  const [remind, setRemind] = useState(true);
  const own = bookings
    .filter(b => b.clientId === client.id)
    .toSorted((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const upcoming = own.filter(
    b => !["Завершена", "Отменена", "Не пришёл"].includes(b.status),
  );
  const history = own
    .filter(b => ["Завершена", "Отменена", "Не пришёл"].includes(b.status))
    .toReversed();
  const next = upcoming[0];
  return (
    <>
      <PublicHeader />
      <main className={`${s.main} page-enter`}>
        <PageHeader
          title={`Здравствуйте, ${client.name.split(" ")[0]}.`}
          description='Ваш автомобиль и планы на следующий визит'
          actions={
            <LinkButton href='/book' icon='plus'>
              Записаться в сервис
            </LinkButton>
          }
        />
        <div className={s.tabs}>
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { value: "bookings", label: "Мои записи" },
              { value: "vehicles", label: "Автомобили" },
              { value: "profile", label: "Профиль" },
            ]}
          />
        </div>
        <div className={s.layout}>
          <div className={u.stack}>
            {tab === "bookings" ? (
              <>
                {next ? (
                  <Card dark className={s.nextVisit}>
                    <div className={u.row}>
                      <span>Ближайший визит</span>
                      <Icon name='calendar' size={24} />
                    </div>
                    <h2>
                      {dateLabel(next.date)}
                      <span>в {next.time}</span>
                    </h2>
                    <p>{services.find(v => v.id === next.serviceId)?.name}</p>
                    <div className={s.visitMeta}>
                      <span>
                        <Icon name='car' size={15} />
                        {
                          client.vehicles.find(v => v.id === next.vehicleId)
                            ?.name
                        }
                      </span>
                      <span>
                        <Icon name='user' size={15} />
                        {team.find(v => v.id === next.workerId)?.name}
                      </span>
                    </div>
                    <div className={s.nextActions}>
                      <Button
                        variant='secondary'
                        onClick={() => setSelected(next.id)}
                      >
                        Подробности визита
                      </Button>
                      <span>
                        {money(
                          services.find(v => v.id === next.serviceId)?.price ||
                            0,
                        )}
                      </span>
                    </div>
                  </Card>
                ) : (
                  <Card>
                    <Empty
                      title='Пока нет предстоящих визитов'
                      description='Выберите услугу и удобное время для вашего автомобиля.'
                    />
                    <LinkButton href='/book'>Записаться</LinkButton>
                  </Card>
                )}
                {upcoming.length > 1 && (
                  <Card>
                    <h2 className={layout.marginBottom18}>
                      Другие предстоящие визиты
                    </h2>
                    {upcoming.slice(1).map(b => (
                      <button
                        key={b.id}
                        className={s.historyRow}
                        onClick={() => setSelected(b.id)}
                      >
                        <span>
                          <strong>
                            {services.find(v => v.id === b.serviceId)?.name}
                          </strong>
                          <small>
                            {dateLabel(b.date)} · {b.time}
                          </small>
                        </span>
                        <Status value={b.status} />
                      </button>
                    ))}
                  </Card>
                )}
                <Card>
                  <h2 className={layout.marginBottom20}>История визитов</h2>
                  {history.map(b => (
                    <div key={b.id} className={s.historyRow}>
                      <button onClick={() => setSelected(b.id)}>
                        <strong>
                          {services.find(v => v.id === b.serviceId)?.name}
                        </strong>
                        <small>
                          {dateLabel(b.date)} ·{" "}
                          {
                            client.vehicles.find(v => v.id === b.vehicleId)
                              ?.name
                          }
                        </small>
                      </button>
                      <Status value={b.status} />
                      <Link
                        href={`/book?service=${b.serviceId}`}
                        aria-label='Записаться повторно'
                      >
                        <Icon name='up' size={17} />
                      </Link>
                    </div>
                  ))}
                  {!history.length && (
                    <Empty
                      title='Здесь появится история визитов'
                      description='После первого обслуживания вы сможете записаться повторно.'
                    />
                  )}
                </Card>
              </>
            ) : tab === "vehicles" ? (
              <>
                <div className={u.row}>
                  <h2>Мои автомобили</h2>
                  <Button
                    variant='secondary'
                    icon='plus'
                    onClick={() => setVehicleEditor("new")}
                  >
                    Добавить
                  </Button>
                </div>
                {client.vehicles.map(v => (
                  <Card key={v.id} className={s.vehicle}>
                    <div className={u.row}>
                      <span className={u.iconTile}>
                        <Icon name='car' size={28} />
                      </span>
                      <span className={s.plate}>{v.plate}</span>
                    </div>
                    <h2>{v.name}</h2>
                    <div className={s.vehicleStats}>
                      <span>
                        <small>Год выпуска</small>
                        <strong>{v.year}</strong>
                      </span>
                      <span>
                        <small>Пробег</small>
                        <strong>{v.mileage} км</strong>
                      </span>
                      <span>
                        <small>Визиты</small>
                        <strong>
                          {own.filter(b => b.vehicleId === v.id).length}
                        </strong>
                      </span>
                    </div>
                    <Button
                      variant='secondary'
                      onClick={() => setVehicleEditor(v)}
                    >
                      Редактировать
                    </Button>
                  </Card>
                ))}
              </>
            ) : (
              <Card>
                <div className={u.profileHero}>
                  <Avatar name={client.name} size='large' />
                  <div>
                    <h2>{client.name}</h2>
                    <p>{client.email}</p>
                  </div>
                </div>
                <form
                  className={u.form}
                  onSubmit={e => {
                    e.preventDefault();
                    const data = new FormData(e.currentTarget);
                    setClients(items =>
                      items.map(c =>
                        c.id === client.id
                          ? {
                              ...c,
                              name: String(data.get("name")),
                              phone: String(data.get("phone")),
                            }
                          : c,
                      ),
                    );
                    notice("Профиль сохранён");
                  }}
                >
                  <Field
                    label='Имя и фамилия'
                    name='name'
                    defaultValue={client.name}
                    required
                  />
                  <Field
                    label='Телефон'
                    name='phone'
                    type='tel'
                    defaultValue={client.phone}
                    required
                  />
                  <Field
                    label='Email'
                    type='email'
                    defaultValue={client.email}
                    readOnly
                  />
                  <Button type='submit'>Сохранить профиль</Button>
                </form>
                <div className={u.divider} />
                <Toggle
                  label='Напоминания о визите'
                  description='За 3 часа до записи'
                  checked={remind}
                  onChange={setRemind}
                />
              </Card>
            )}
          </div>
          <aside className={u.stack}>
            <Card>
              <div className={u.row}>
                <h2>Ваш сервис</h2>
                <Icon name='garage' size={22} />
              </div>
              <h3 className={layout.marginTop25}>Wehicle Service</h3>
              <p className={s.contact}>
                <Icon name='pin' size={17} /> Москва, ул. Автозаводская, 23
              </p>
              <p className={s.contact}>
                <Icon name='clock' size={17} /> Пн–Сб: 09:00–19:00
              </p>
              <Link className={s.contact} href='tel:+74951234567'>
                <Icon name='phone' size={17} /> +7 (495) 123-45-67
              </Link>
            </Card>
            <Card>
              <span className={u.iconTile}>
                <Icon name='telegram' size={27} />
              </span>
              <h2 className={u.cardTitle}>Важное — в Telegram</h2>
              <p className={u.serviceDescription}>
                Подтверждения и напоминания о визите прямо в вашем мессенджере.
              </p>
              <Button
                variant={telegram ? "secondary" : "primary"}
                onClick={() => {
                  setTelegram(!telegram);
                  notice(
                    telegram
                      ? "Telegram отключён"
                      : "Telegram подключён в демо",
                  );
                }}
              >
                {telegram ? "Отключить" : "Подключить Telegram"}
              </Button>
            </Card>
            <Link className={s.logout} href='/login'>
              <Icon name='logout' size={17} /> Выйти из кабинета
            </Link>
          </aside>
        </div>
        <footer className={s.footer}>
          Демонстрационный личный кабинет · Wehicle Service
        </footer>
      </main>
      {selected && (
        <BookingDetails
          bookingId={selected}
          customer
          onClose={() => setSelected("")}
        />
      )}{" "}
      {vehicleEditor && (
        <RecordEditor
          title={
            vehicleEditor === "new"
              ? "Добавить автомобиль"
              : "Редактировать автомобиль"
          }
          fields={[
            {
              key: "name",
              label: "Марка и модель",
              value: vehicleEditor === "new" ? "" : vehicleEditor.name,
            },
            {
              key: "plate",
              label: "Госномер",
              value: vehicleEditor === "new" ? "" : vehicleEditor.plate,
            },
            {
              key: "year",
              label: "Год выпуска",
              type: "number",
              value: vehicleEditor === "new" ? "2021" : vehicleEditor.year,
            },
            {
              key: "mileage",
              label: "Пробег, км",
              value: vehicleEditor === "new" ? "0" : vehicleEditor.mileage,
            },
          ]}
          onClose={() => setVehicleEditor(null)}
          onSave={v => {
            setClients(items =>
              items.map(c =>
                c.id === client.id
                  ? {
                      ...c,
                      vehicles:
                        vehicleEditor === "new"
                          ? [
                              ...c.vehicles,
                              {
                                id: `v${Date.now()}`,
                                name: v.name,
                                plate: v.plate,
                                year: v.year,
                                mileage: v.mileage,
                              },
                            ]
                          : c.vehicles.map(car =>
                              car.id === vehicleEditor.id
                                ? { ...car, ...v }
                                : car,
                            ),
                    }
                  : c,
              ),
            );
            notice("Автомобиль сохранён");
          }}
        />
      )}
    </>
  );
}
