"use client";
import layout from "@/shared/styles/utility.module.scss";
import { useState } from "react";
import { useDemo } from "@/entities/workspace/model/provider";
import {
  RecordEditor,
  type EditorField,
} from "@/features/record-editor/ui/record-editor";
import type { Service } from "@/entities/service/model/mock";
import {
  Card,
  PageHeader,
  Button,
  Search,
  Segmented,
  Empty,
  Dialog,
  Toggle,
} from "@/shared/ui/controls";
import { Icon } from "@/shared/ui/icon";
import { money } from "@/shared/lib/format";
import s from "@/shared/styles/screen.module.scss";
export default function Services() {
  const { services, setServices, team, setTeam, notice } = useDemo();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [editing, setEditing] = useState<Service | "new" | null>(null);
  const [assign, setAssign] = useState<Service | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const filtered = services.filter(
    v =>
      (showArchived || !v.archived) &&
      (category === "Все" || v.category === category) &&
      v.name.toLowerCase().includes(search.toLowerCase()),
  );
  const fields: EditorField[] = [
    {
      key: "name",
      label: "Название",
      value: editing && editing !== "new" ? editing.name : "",
    },
    {
      key: "description",
      label: "Описание",
      value: editing && editing !== "new" ? editing.description : "",
    },
    {
      key: "price",
      label: "Цена, ₽",
      type: "number",
      value: editing && editing !== "new" ? String(editing.price) : "3000",
    },
    {
      key: "duration",
      label: "Длительность, мин",
      type: "number",
      value: editing && editing !== "new" ? String(editing.duration) : "60",
    },
    {
      key: "category",
      label: "Категория",
      options: ["Обслуживание", "Диагностика", "Ремонт"],
      value: editing && editing !== "new" ? editing.category : "Обслуживание",
    },
  ];
  return (
    <>
      <PageHeader
        title='Услуги'
        description='Каталог, стоимость и исполнители'
        actions={
          <Button icon='plus' onClick={() => setEditing("new")}>
            Добавить услугу
          </Button>
        }
      />
      <div className={s.toolbar}>
        <Segmented
          value={category}
          onChange={setCategory}
          options={["Все", "Обслуживание", "Диагностика", "Ремонт"].map(v => ({
            value: v,
            label: v,
          }))}
        />
        <Search
          value={search}
          onChange={setSearch}
          placeholder='Найти услугу'
        />
      </div>
      <div className={s.grid}>
        {filtered.map(v => (
          <Card key={v.id}>
            <div className={s.row}>
              <span className={s.iconTile}>
                <Icon name={v.icon} size={26} />
              </span>
              <Button
                variant='ghost'
                onClick={() => setEditing(v)}
                aria-label={`Редактировать ${v.name}`}
              >
                <Icon name='more' />
              </Button>
            </div>
            <h2 className={s.cardTitle}>
              {v.name}
              {v.archived ? " · Архив" : ""}
            </h2>
            <p className={s.serviceDescription}>{v.description}</p>
            <div className={s.row}>
              <strong className={s.price}>{money(v.price)}</strong>
              <span className={s.muted}>{v.duration} мин</span>
            </div>
            <div className={s.divider} />
            <div className={s.row}>
              <span className={s.muted}>
                {
                  team.filter(
                    t => t.serviceIds.includes(v.id) && t.status !== "Уволен",
                  ).length
                }{" "}
                исполнителей
              </span>
              <Button variant='ghost' onClick={() => setAssign(v)}>
                Назначить
              </Button>
            </div>
            <div className={`${s.row} ${layout.marginTop8}`}>
              <Button variant='secondary' onClick={() => setEditing(v)}>
                Редактировать
              </Button>
              <Button
                variant='ghost'
                onClick={() => {
                  setServices(items =>
                    items.map(i =>
                      i.id === v.id ? { ...i, archived: !i.archived } : i,
                    ),
                  );
                  notice(
                    v.archived ? "Услуга восстановлена" : "Услуга в архиве",
                  );
                }}
              >
                {v.archived ? "Восстановить" : "В архив"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {!filtered.length && (
        <Card>
          <Empty />
        </Card>
      )}
      <div className={layout.marginTop20}>
        <Button variant='ghost' onClick={() => setShowArchived(!showArchived)}>
          {showArchived ? "Скрыть архив" : "Показать архив"}
        </Button>
      </div>
      {editing && (
        <RecordEditor
          key={editing === "new" ? "new" : editing.id}
          title={editing === "new" ? "Новая услуга" : "Редактировать услугу"}
          fields={fields}
          onClose={() => setEditing(null)}
          onSave={values => {
            const record: Service = {
              id: editing === "new" ? `s${Date.now()}` : editing.id,
              icon: editing === "new" ? "engine" : editing.icon,
              name: values.name,
              description: values.description,
              price: Number(values.price),
              duration: Math.max(15, Number(values.duration)),
              category: values.category,
            };
            setServices(items =>
              editing === "new"
                ? [...items, { ...record, icon: "engine" }]
                : items.map(v =>
                    v.id === editing.id ? { ...v, ...record } : v,
                  ),
            );
            notice("Услуга сохранена");
          }}
        />
      )}
      <Dialog
        open={!!assign}
        onClose={() => setAssign(null)}
        title={`Мастера · ${assign?.name || ""}`}
      >
        {team
          .filter(t => t.role === "Мастер" && t.status !== "Уволен")
          .map(t => (
            <Toggle
              key={t.id}
              label={t.name}
              description={t.speciality}
              checked={t.serviceIds.includes(assign?.id || "")}
              onChange={checked =>
                setTeam(items =>
                  items.map(v =>
                    v.id === t.id
                      ? {
                          ...v,
                          serviceIds: checked
                            ? [...v.serviceIds, assign!.id]
                            : v.serviceIds.filter(id => id !== assign!.id),
                        }
                      : v,
                  ),
                )
              }
            />
          ))}
        <div className={s.detailActions}>
          <Button
            onClick={() => {
              setAssign(null);
              notice("Исполнители назначены");
            }}
          >
            Готово
          </Button>
        </div>
      </Dialog>
    </>
  );
}
