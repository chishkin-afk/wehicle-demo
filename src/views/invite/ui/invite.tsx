"use client";
import layout from "@/shared/styles/utility.module.scss";
import { useState } from "react";
import Link from "@/shared/ui/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/entities/workspace/model/provider";
import { Card, Field, Button, Avatar, LinkButton } from "@/shared/ui/controls";
import { Icon } from "@/shared/ui/icon";
import s from "@/shared/styles/auth.module.scss";
export default function Invite({ token }: { token: string }) {
  const router = useRouter();
  const { team, setTeam, setRole } = useDemo();
  const pending = team.find(t => t.status === "Приглашён");
  const [accepted, setAccepted] = useState(token === "used");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const expired = token !== "demo" && token !== "used";
  return (
    <div className={`${s.page} page-enter`}>
      <Link href='/' className={s.logo}>
        wehicle.
      </Link>
      <Card className={`${s.formCard} ${s.inviteCard}`}>
        {expired || accepted ? (
          <>
            <Icon name={expired ? "warning" : "success"} size={45} />
            <h2 className={layout.marginTop22}>
              {expired ? "Приглашение недоступно" : "Приглашение принято"}
            </h2>
            <p className={s.subtitle}>
              {expired
                ? "Попросите менеджера отправить новое приглашение."
                : "Теперь можно войти в рабочее пространство."}
            </p>
            <LinkButton href='/login'>Перейти ко входу</LinkButton>
          </>
        ) : (
          <>
            <h2>
              Добро пожаловать
              <br />в команду.
            </h2>
            <p className={s.subtitle}>Вас пригласили в Wehicle Service.</p>
            <div className={s.inviteInfo}>
              <Avatar name={pending?.name || "Алексей Никитин"} />
              <div>
                <strong>{pending?.name || "Алексей Никитин"}</strong>
                <small>
                  {pending?.email || "a.nikitin@wehicle.ru"} ·{" "}
                  {pending?.role || "Мастер"}
                </small>
              </div>
            </div>
            <form
              className={s.form}
              onSubmit={e => {
                e.preventDefault();
                if (password !== confirmation) {
                  setError("Пароли не совпадают.");
                  return;
                }
                if (pending)
                  setTeam(items =>
                    items.map(t =>
                      t.id === pending.id ? { ...t, status: "Работает" } : t,
                    ),
                  );
                setRole(pending?.role === "Менеджер" ? "Менеджер" : "Мастер");
                setAccepted(true);
              }}
            >
              <Field
                label='Придумайте пароль'
                type='password'
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete='new-password'
              />
              <Field
                label='Повторите пароль'
                type='password'
                minLength={8}
                value={confirmation}
                onChange={e => setConfirmation(e.target.value)}
                required
                autoComplete='new-password'
              />
              {error && (
                <p className={s.error} role='alert'>
                  {error}
                </p>
              )}
              <Button type='submit'>Принять приглашение</Button>
            </form>
            <div className={s.demo}>
              <Icon name='shield' size={17} />
              <p>
                Демо-приглашение. Пароль не передаётся на сервер и не
                сохраняется.
              </p>
            </div>
          </>
        )}
      </Card>
      <footer className={s.footer}>
        <Link href='/'>На главную</Link>
        <span>© 2026 Wehicle Service</span>
      </footer>
    </div>
  );
}
