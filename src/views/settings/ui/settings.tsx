"use client";
import layout from "@/shared/styles/utility.module.scss";
import { useState } from "react";
import { useDemo } from "@/entities/workspace/model/provider";
import { useQueryState } from "@/shared/lib/use-query-state";
import {
  Card,
  PageHeader,
  Button,
  Segmented,
  Field,
  Toggle,
  Avatar,
  Select,
  Badge,
} from "@/shared/ui/controls";
import { Icon } from "@/shared/ui/icon";
import s from "@/shared/styles/screen.module.scss";
export default function Settings() {
  const { notice, role } = useDemo();
  const [tab, setTab] = useQueryState("tab", "profile");
  const [telegram, setTelegram] = useState(false);
  const [notify, setNotify] = useState({
    booking: true,
    cancel: true,
    reminder: true,
  });
  const options = [
    { value: "profile", label: "Мой профиль" },
    ...(role !== "Мастер"
      ? [
          { value: "business", label: "Бизнес" },
          { value: "rules", label: "Правила записи" },
        ]
      : []),
    ...(role === "Владелец"
      ? [{ value: "integrations", label: "Интеграции" }]
      : []),
  ];
  const active = options.some(o => o.value === tab) ? tab : "profile";
  return (
    <>
      <PageHeader
        title='Настройки'
        description='Ваш профиль и рабочее пространство'
      />
      <div className={layout.marginBottom24}>
        <Segmented value={active} onChange={setTab} options={options} />
      </div>
      <div className={s.twoColumns}>
        <Card>
          <form
            className={s.form}
            onSubmit={e => {
              e.preventDefault();
              notice("Настройки сохранены в демо");
            }}
          >
            {active === "profile" ? (
              <>
                <div className={s.profileHero}>
                  <Avatar name='Егор Фролов' size='large' />
                  <div>
                    <h2>Егор Фролов</h2>
                    <p>{role} · Wehicle Service</p>
                  </div>
                </div>
                <div className={s.formGrid}>
                  <Field label='Имя' defaultValue='Егор' required />
                  <Field label='Фамилия' defaultValue='Фролов' required />
                </div>
                <Field
                  label='Email'
                  type='email'
                  defaultValue='egor@wehicle.ru'
                  required
                />
                <Field
                  label='Телефон'
                  type='tel'
                  defaultValue='+7 (999) 765-43-21'
                />
                <div className={s.divider} />
                <h3>Изменить пароль</h3>
                <Field
                  label='Новый пароль'
                  type='password'
                  minLength={8}
                  placeholder='Не менее 8 символов'
                  autoComplete='new-password'
                />
              </>
            ) : active === "business" ? (
              <>
                <h2>Информация о сервисе</h2>
                <Field
                  label='Название'
                  defaultValue='Wehicle Service'
                  required
                />
                <Field
                  label='Адрес'
                  defaultValue='Москва, ул. Автозаводская, 23'
                  required
                />
                <div className={s.formGrid}>
                  <Field
                    label='Телефон'
                    defaultValue='+7 (495) 123-45-67'
                    type='tel'
                    required
                  />
                  <Field
                    label='Email'
                    defaultValue='hello@wehicle.ru'
                    type='email'
                    required
                  />
                </div>
                <Field
                  label='Часовой пояс'
                  defaultValue='Москва · UTC+3'
                  readOnly
                />
                <div className={s.formGrid}>
                  <Field
                    label='Открытие'
                    type='time'
                    defaultValue='09:00'
                    required
                  />
                  <Field
                    label='Закрытие'
                    type='time'
                    defaultValue='19:00'
                    required
                  />
                </div>
              </>
            ) : active === "rules" ? (
              <>
                <h2>Правила онлайн-записи</h2>
                <Field
                  label='Запись вперёд, дней'
                  type='number'
                  min={1}
                  max={90}
                  defaultValue={30}
                  required
                />
                <Field
                  label='Минимум до визита, часов'
                  type='number'
                  min={0}
                  defaultValue={2}
                  required
                />
                <Field
                  label='Отмена и перенос до визита, часов'
                  type='number'
                  min={0}
                  defaultValue={4}
                  required
                />
                <Field
                  label='Напоминание до визита, часов'
                  type='number'
                  min={1}
                  defaultValue={3}
                  required
                />
                <p className={s.note}>
                  Длительность визита зависит от услуги. Перерывы и отпуска
                  исключаются из доступного времени.
                </p>
              </>
            ) : (
              <>
                <div className={s.row}>
                  <h2>Telegram-бот</h2>
                  <Badge>Демо</Badge>
                </div>
                <Field
                  label='Токен бота'
                  type='password'
                  placeholder='Вставьте токен из BotFather'
                />
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() =>
                    notice("Тест Telegram: уведомление показано в демо")
                  }
                >
                  Проверить подключение
                </Button>
                <div className={s.divider} />
                <h2>Почтовые уведомления</h2>
                <Field label='SMTP-сервер' placeholder='smtp.example.ru' />
                <div className={s.formGrid}>
                  <Field label='Порт' type='number' defaultValue={465} />
                  <Field
                    label='Email отправителя'
                    type='email'
                    placeholder='hello@wehicle.ru'
                  />
                </div>
                <Field
                  label='Пароль приложения'
                  type='password'
                  autoComplete='new-password'
                />
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() =>
                    notice("Тест почты: отправка не выполняется в демо")
                  }
                >
                  Тестовое уведомление
                </Button>
              </>
            )}
            <Button type='submit'>Сохранить изменения</Button>
          </form>
        </Card>
        <div className={s.stack}>
          <Card>
            <div className={s.row}>
              <span className={s.iconTile}>
                <Icon name='telegram' size={25} />
              </span>
              <Badge tone={telegram ? "positive" : "neutral"}>
                {telegram ? "Подключён" : "Не подключён"}
              </Badge>
            </div>
            <h2 className={s.cardTitle}>Уведомления в Telegram</h2>
            <p className={s.serviceDescription}>
              Записи и напоминания в привычном месте. Подключите свой аккаунт к
              боту сервиса.
            </p>
            <Button
              variant={telegram ? "secondary" : "primary"}
              onClick={() => {
                setTelegram(!telegram);
                notice(
                  telegram ? "Telegram отключён" : "Telegram подключён в демо",
                );
              }}
            >
              {telegram ? "Отключить" : "Подключить Telegram"}
            </Button>
          </Card>
          <Card>
            <h2>Мои уведомления</h2>
            {[
              {
                key: "booking" as const,
                label: "Новые записи",
                description: "Когда клиент записывается к вам",
              },
              {
                key: "cancel" as const,
                label: "Отмены и переносы",
                description: "Когда планы меняются",
              },
              {
                key: "reminder" as const,
                label: "Напоминания",
                description: "За 3 часа до визита",
              },
            ].map(n => (
              <Toggle
                key={n.key}
                label={n.label}
                description={n.description}
                checked={notify[n.key]}
                onChange={v => setNotify({ ...notify, [n.key]: v })}
              />
            ))}
          </Card>
          <p className={s.note}>
            Это демонстрационная версия. Подключения и уведомления моделируются
            локально.
          </p>
        </div>
      </div>
    </>
  );
}
