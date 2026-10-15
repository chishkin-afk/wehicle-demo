"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "@/shared/ui/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/entities/workspace/model/provider";
import { Card, Field, Button, Segmented, Select } from "@/shared/ui/controls";
import { Icon } from "@/shared/ui/icon";
import s from "@/shared/styles/auth.module.scss";
export default function Login() {
  const router = useRouter();
  const { clients, setCustomerId, setRole, role, notice } = useDemo();
  const [mode, setMode] = useState("client");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("alex.morozov@mail.ru");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [reset, setReset] = useState(false);
  return (
    <div className={`${s.page} page-enter`}>
      <Link href='/' className={s.logo}>
        wehicle.
      </Link>
      <div className={s.layout}>
        <section className={s.intro}>
          <span className={s.introIcon}>
            <Icon name='car' size={34} weight='light' />
          </span>
          <h1>
            Меньше забот.
            <br />
            Больше движения.
          </h1>
          <p>
            Ваш автомобиль и каждый визит —<br />в одном личном кабинете.
          </p>
          <div className={s.photo}>
            <Image
              src='/images/workshop.png'
              alt='Автомобиль в мастерской'
              fill
              sizes='550px'
              loading='eager'
            />
          </div>
          <span className={s.introFoot}>Сервис, которому можно доверять.</span>
        </section>
        <Card className={s.formCard}>
          <h2>
            {reset
              ? "Восстановить пароль"
              : sent
                ? "Проверьте почту"
                : "С возвращением."}
          </h2>
          <p className={s.subtitle}>
            {reset
              ? "Укажите почту рабочего аккаунта."
              : sent
                ? `Введите код для ${email}`
                : "Войдите, чтобы продолжить."}
          </p>
          {!reset && !sent && (
            <Segmented
              value={mode}
              onChange={v => {
                setMode(v);
                setError("");
                setEmail(
                  v === "staff" ? "egor@wehicle.ru" : "alex.morozov@mail.ru",
                );
              }}
              options={[
                { value: "client", label: "Клиент" },
                { value: "staff", label: "Сотрудник" },
              ]}
            />
          )}
          <form
            className={s.form}
            onSubmit={e => {
              e.preventDefault();
              setError("");
              if (reset) {
                notice(
                  "Демо: ссылка восстановления сформирована, письмо не отправляется",
                );
                setReset(false);
                return;
              }
              if (mode === "staff") {
                router.push(
                  role === "Мастер" ? "/dashboard/bookings" : "/dashboard",
                );
                return;
              }
              if (!sent) {
                setSent(true);
                return;
              }
              if (code !== "123456") {
                setError("Неверный код. В демо используйте 123456.");
                return;
              }
              const client = clients.find(
                c => c.email.toLowerCase() === email.toLowerCase(),
              );
              if (!client) {
                setError(
                  "Для демо используйте alex.morozov@mail.ru или создайте запись с этим email.",
                );
                return;
              }
              setCustomerId(client.id);
              router.push("/account");
            }}
          >
            {!sent ? (
              <Field
                label='Email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete='email'
              />
            ) : (
              <Field
                label='Код подтверждения'
                inputMode='numeric'
                value={code}
                onChange={e => setCode(e.target.value)}
                maxLength={6}
                placeholder='123456'
                autoFocus
                required
              />
            )}
            {mode === "staff" && !reset && (
              <>
                <Field
                  label='Пароль'
                  type='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  minLength={8}
                  required
                  autoComplete='current-password'
                />
                <Select
                  label='Роль в демо'
                  value={role}
                  onChange={v => setRole(v as typeof role)}
                  options={["Владелец", "Менеджер", "Мастер"].map(v => ({
                    value: v,
                    label: v,
                  }))}
                />
                <button
                  type='button'
                  className={s.textButton}
                  onClick={() => setReset(true)}
                >
                  Забыли пароль?
                </button>
              </>
            )}
            {error && (
              <p className={s.error} role='alert'>
                {error}
              </p>
            )}
            <Button type='submit'>
              {reset
                ? "Отправить ссылку"
                : sent || mode === "staff"
                  ? "Войти"
                  : "Получить код"}
              <Icon name='right' size={16} />
            </Button>
          </form>
          {sent && (
            <button
              className={s.textButton}
              onClick={() => {
                notice("Демо-код: 123456");
              }}
            >
              Отправить код ещё раз
            </button>
          )}
          {(sent || reset) && (
            <button
              className={s.textButton}
              onClick={() => {
                setSent(false);
                setReset(false);
              }}
            >
              Вернуться к входу
            </button>
          )}
          <div className={s.demo}>
            <Icon name='shield' size={17} />
            <p>
              {mode === "client"
                ? "Демо-код: 123456. Письма не отправляются."
                : "Демо-вход: любой пароль от 8 символов."}
            </p>
          </div>
        </Card>
      </div>
      <footer className={s.footer}>
        <Link href='/'>На главную</Link>
        <span>© 2026 Wehicle Service</span>
      </footer>
    </div>
  );
}
