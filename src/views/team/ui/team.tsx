"use client";
import layout from "@/shared/styles/utility.module.scss";
import { useState } from "react";
import Link from "@/shared/ui/link";
import { useDemo } from "@/entities/workspace/model/provider";
import { useQueryState } from "@/shared/lib/use-query-state";
import { RecordEditor } from "@/features/record-editor/ui/record-editor";
import {
  Card,
  PageHeader,
  Button,
  Avatar,
  Segmented,
  Search,
  Status,
  Dialog,
  Toggle,
  Select,
} from "@/shared/ui/controls";
import { Icon } from "@/shared/ui/icon";
import type { Employee } from "@/entities/team/model/mock";
import s from "@/shared/styles/screen.module.scss";
export default function Team() {
  const { team, setTeam, services, notice, role } = useDemo();
  const [tab, setTab] = useQueryState("tab", "team");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [invite, setInvite] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmFire, setConfirmFire] = useState(false);
  const member = team.find(t => t.id === selected);
  const filtered = team.filter(
    t =>
      (role !== "Мастер" || t.id === "w1") &&
      t.name.toLowerCase().includes(search.toLowerCase()),
  );
  const update = (patch: Partial<Employee>) => {
    setTeam(items =>
      items.map(t => (t.id === selected ? { ...t, ...patch } : t)),
    );
  };
  return (
    <>
      <PageHeader
        title='Команда'
        description='Люди, которые делают ваш сервис лучше'
        actions={
          role !== "Мастер" ? (
            <Button icon='plus' onClick={() => setInvite(true)}>
              Пригласить сотрудника
            </Button>
          ) : undefined
        }
      />
      <div className={s.toolbar}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: "team", label: "Сотрудники" },
            { value: "schedule", label: "Расписание" },
          ]}
        />
        <Search
          value={search}
          onChange={setSearch}
          placeholder='Найти сотрудника'
        />
      </div>
      {tab === "team" ? (
        <div className={s.grid}>
          {filtered.map(t => (
            <Card key={t.id}>
              <div className={s.row}>
                <Avatar name={t.name} size='large' />
                <Status value={t.status} />
              </div>
              <h2 className={s.cardTitle}>{t.name}</h2>
              <p className={s.muted}>
                {t.role} · {t.speciality}
              </p>
              <div className={s.chips}>
                {t.serviceIds.slice(0, 2).map(id => (
                  <span key={id} className={s.chip}>
                    {services.find(v => v.id === id)?.name}
                  </span>
                ))}
              </div>
              <div className={s.divider} />
              <div className={s.row}>
                <span className={s.muted}>{t.shift}</span>
                <Button variant='ghost' onClick={() => setSelected(t.id)}>
                  Подробнее <Icon name='up' size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className={`${s.row} ${layout.marginBottom20}`}>
            <h2>12–18 октября</h2>
            <span className={s.muted}>Перерыв 12:00–13:00</span>
          </div>
          <div className={s.tableWrap}>
            <table className={s.schedule}>
              <thead>
                <tr>
                  <th>Сотрудник</th>
                  {[
                    "Пн, 12",
                    "Вт, 13",
                    "Ср, 14",
                    "Чт, 15",
                    "Пт, 16",
                    "Сб, 17",
                    "Вс, 18",
                  ].map(d => (
                    <th key={d}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered
                  .filter(t => t.role === "Мастер")
                  .map(t => (
                    <tr key={t.id}>
                      <td>
                        <div className={s.person}>
                          <Avatar name={t.name} />
                          <strong>{t.name}</strong>
                        </div>
                      </td>
                      {Array.from({ length: 7 }, (_, i) => (
                        <td key={i}>
                          {t.status === "В отпуске" ? (
                            <span className={s.chip}>Отпуск</span>
                          ) : i > 4 ? (
                            <span className={s.muted}>Выходной</span>
                          ) : (
                            <button
                              className={s.shift}
                              onClick={() => setSelected(t.id)}
                            >
                              {t.shift}
                            </button>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <Dialog
        open={!!member}
        onClose={() => {
          setSelected("");
          setEditing(false);
        }}
        title='Карточка сотрудника'
        drawer
      >
        {member && (
          <>
            <div className={s.profileHero}>
              <Avatar name={member.name} size='large' />
              <div>
                <h2>{member.name}</h2>
                <p>{member.email}</p>
              </div>
            </div>
            <Status value={member.status} />
            <div className={s.detailRow}>
              <span>Роль</span>
              <strong>{member.role}</strong>
            </div>
            <div className={s.detailRow}>
              <span>Рабочий график</span>
              <strong>{member.shift}</strong>
            </div>
            <div className={s.detailRow}>
              <span>Перерыв</span>
              <strong>12:00–13:00</strong>
            </div>
            {role !== "Мастер" && (
              <>
                <h3 className={layout.employeeHeading}>Услуги сотрудника</h3>
                {member.role === "Мастер" &&
                  services
                    .filter(v => !v.archived)
                    .map(v => (
                      <Toggle
                        key={v.id}
                        label={v.name}
                        checked={member.serviceIds.includes(v.id)}
                        onChange={checked =>
                          update({
                            serviceIds: checked
                              ? [...member.serviceIds, v.id]
                              : member.serviceIds.filter(id => id !== v.id),
                          })
                        }
                      />
                    ))}
                <div className={s.detailActions}>
                  <Button variant='secondary' onClick={() => setEditing(true)}>
                    Изменить график
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={() => {
                      update({
                        status:
                          member.status === "В отпуске"
                            ? "Работает"
                            : "В отпуске",
                      });
                      notice(
                        member.status === "В отпуске"
                          ? "Сотрудник вернулся из отпуска"
                          : "Отпуск назначен",
                      );
                    }}
                  >
                    {member.status === "В отпуске"
                      ? "Завершить отпуск"
                      : "Назначить отпуск"}
                  </Button>
                  <Button variant='danger' onClick={() => setConfirmFire(true)}>
                    Отключить доступ
                  </Button>
                </div>
                {member.status === "Приглашён" && (
                  <div className={s.detailActions}>
                    <Link href='/invite/demo' className={s.link}>
                      Открыть приглашение
                    </Link>
                    <Button
                      variant='ghost'
                      onClick={() =>
                        notice("Демо-приглашение готово: /invite/demo")
                      }
                    >
                      Повторить приглашение
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Dialog>
      {invite && (
        <RecordEditor
          title='Пригласить сотрудника'
          fields={[
            { key: "name", label: "Имя и фамилия" },
            { key: "email", label: "Email", type: "email" },
            {
              key: "role",
              label: "Роль",
              value: "Мастер",
              options:
                role === "Владелец" ? ["Мастер", "Менеджер"] : ["Мастер"],
            },
            {
              key: "speciality",
              label: "Специализация",
              value: "Техническое обслуживание",
            },
          ]}
          onClose={() => setInvite(false)}
          onSave={v => {
            setTeam(items => [
              ...items,
              {
                id: `w${Date.now()}`,
                name: v.name,
                email: v.email,
                role: v.role as Employee["role"],
                speciality: v.speciality,
                status: "Приглашён",
                serviceIds: [],
                shift: "09:00–18:00",
              },
            ]);
            notice("Приглашение создано. Демо-ссылка: /invite/demo");
          }}
        />
      )}
      {editing && member && (
        <RecordEditor
          title='Рабочее расписание'
          fields={[
            {
              key: "start",
              label: "Начало смены",
              type: "time",
              value: member.shift.split("–")[0],
            },
            {
              key: "end",
              label: "Конец смены",
              type: "time",
              value: member.shift.split("–")[1],
            },
          ]}
          onClose={() => setEditing(false)}
          onSave={v => {
            if (v.end <= v.start) {
              notice("Конец смены должен быть позже начала");
              return false;
            }
            update({ shift: `${v.start}–${v.end}` });
            notice("График обновлён");
          }}
        />
      )}
      <Dialog
        open={confirmFire}
        onClose={() => setConfirmFire(false)}
        title='Отключить доступ?'
      >
        <p className={s.muted}>
          Сотрудник будет исключён из будущих записей. История визитов
          останется.
        </p>
        <div className={s.detailActions}>
          <Button variant='secondary' onClick={() => setConfirmFire(false)}>
            Отмена
          </Button>
          <Button
            variant='danger'
            onClick={() => {
              update({ status: "Уволен" });
              setConfirmFire(false);
              notice("Доступ сотрудника отключён");
            }}
          >
            Отключить
          </Button>
        </div>
      </Dialog>
    </>
  );
}
