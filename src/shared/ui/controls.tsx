"use client";
import { initials } from "@/shared/lib/format";
import Link from "@/shared/ui/link";
import {
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import s from "./controls.module.scss";
import { Icon, type IconName } from "./icon";
export function Button({
  children,
  variant = "primary",
  icon,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: IconName;
}) {
  return (
    <button className={`${s.button} ${s[variant]} ${className}`} {...props}>
      {icon && <Icon name={icon} size={18} />} {children}
    </button>
  );
}
export function LinkButton({
  href,
  children,
  variant = "primary",
  icon,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  icon?: IconName;
}) {
  return (
    <Link className={`${s.button} ${s[variant]}`} href={href}>
      {icon && <Icon name={icon} size={18} />} {children}
    </Link>
  );
}
export function IconButton({
  name,
  label,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  name: IconName;
  label: string;
}) {
  return (
    <button className={s.iconButton} aria-label={label} {...props}>
      <Icon name={name} />
    </button>
  );
}
export function Avatar({
  name,
  size = "normal",
}: {
  name: string;
  size?: "normal" | "large" | "small";
}) {
  return (
    <span className={`${s.avatar} ${s[size]}`} aria-label={name}>
      {initials(name)}
    </span>
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "positive" | "warning" | "negative";
}) {
  return (
    <span className={`${s.badge} ${s[tone]}`}>
      <span />
      {children}
    </span>
  );
}
export function Status({ value }: { value: string }) {
  const tone = [
    "Завершена",
    "Подтверждена",
    "Готов",
    "Работает",
    "Выдан",
  ].includes(value)
    ? "positive"
    : ["В работе", "Ожидает", "Принят", "Приглашён"].includes(value)
      ? "warning"
      : ["Отменена", "Не пришёл", "Уволен"].includes(value)
        ? "negative"
        : "neutral";
  return <Badge tone={tone}>{value}</Badge>;
}
export function Card({
  children,
  className = "",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section className={`${s.card} ${dark ? s.dark : ""} ${className}`}>
      {children}
    </section>
  );
}
export function Field({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = useId();
  return (
    <label className={s.field} htmlFor={id}>
      <span>{label}</span>
      <input id={id} {...props} />
    </label>
  );
}
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useId();
  return (
    <label className={s.field} htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
export function Search({
  value,
  onChange,
  placeholder = "Поиск",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className={s.search}>
      <Icon name='search' size={19} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button aria-label='Очистить поиск' onClick={() => onChange("")}>
          <Icon name='close' size={16} />
        </button>
      )}
    </label>
  );
}
export function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={s.segmented}>
      {options.map(o => (
        <button
          key={o.value}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={value === o.value ? s.selected : ""}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className={s.toggle}>
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <input
        type='checkbox'
        role='switch'
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
    </label>
  );
}
export function Dialog({
  open,
  onClose,
  title,
  children,
  drawer = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  drawer?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const el = ref.current;
    if (open && !el?.open) el?.showModal();
    if (!open && el?.open) el.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`${s.dialog} ${drawer ? s.drawer : ""}`}
      onCancel={e => {
        e.preventDefault();
        onClose();
      }}
      aria-labelledby={titleId}
      onClick={e => {
        if (e.target === ref.current) {
          const r = ref.current.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <div className={s.dialogHeader}>
        <h2 id={titleId}>{title}</h2>
        <IconButton name='close' label='Закрыть' onClick={onClose} />
      </div>
      {children}
    </dialog>
  );
}
export function Empty({
  title = "Ничего не найдено",
  description = "Попробуйте изменить параметры поиска.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className={s.empty}>
      <Icon name='search' size={32} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className={s.pageHeader}>
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className={s.actions}>{actions}</div>}
    </div>
  );
}
export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className={s.sectionHeader}>
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
