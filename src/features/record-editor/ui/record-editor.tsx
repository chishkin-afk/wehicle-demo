"use client";
import { Button, Dialog, Field, Select } from "@/shared/ui/controls";
import { useState } from "react";
export interface EditorField {
  key: string;
  label: string;
  type?: string;
  value?: string;
  required?: boolean;
  options?: string[];
}
export function RecordEditor({
  title,
  fields,
  onClose,
  onSave,
}: {
  title: string;
  fields: EditorField[];
  onClose: () => void;
  onSave: (values: Record<string, string>) => void | boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map(f => [f.key, f.value || ""])),
  );
  return (
    <Dialog open onClose={onClose} title={title}>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (onSave(values) === false) return;
          onClose();
        }}
      >
        {fields.map(f =>
          f.options ? (
            <Select
              key={f.key}
              label={f.label}
              value={values[f.key]}
              onChange={v => setValues({ ...values, [f.key]: v })}
              options={f.options.map(v => ({ value: v, label: v }))}
            />
          ) : (
            <Field
              key={f.key}
              label={f.label}
              type={f.type || "text"}
              required={f.required !== false}
              min={f.type === "number" ? 0 : undefined}
              value={values[f.key]}
              onChange={e => setValues({ ...values, [f.key]: e.target.value })}
            />
          ),
        )}
        <Button type='submit'>Сохранить</Button>
      </form>
    </Dialog>
  );
}
