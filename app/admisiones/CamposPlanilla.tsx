"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CircleAlert, Check } from "lucide-react";

export const inputClass =
  "w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-3.5 py-2.5 text-sm font-semibold text-on-surface placeholder:font-normal placeholder:text-on-surface-variant/60 transition-colors focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20";

export const inputErrorClass =
  "border-error/60 bg-error-container/20 focus:border-error focus:ring-error/20";

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

export function FieldShell({
  id,
  label,
  required,
  error,
  hint,
  className = "",
  children,
}: FieldShellProps) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label
        htmlFor={id}
        className="mb-1 flex items-baseline gap-1 text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-on-surface-variant"
      >
        <span>{label}</span>
        {required && (
          <span className="text-tertiary" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-[0.68rem] font-medium leading-snug text-on-surface-variant/80">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 flex items-start gap-1 text-[0.7rem] font-semibold leading-snug text-error"
        >
          <CircleAlert className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  hint?: string;
  type?: "text" | "date" | "email" | "tel" | "number";
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "decimal";
  maxLength?: number;
  className?: string;
  readOnly?: boolean;
  onBlur?: () => void;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  required,
  hint,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  className,
  readOnly,
  onBlur,
}: TextFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} ${error ? inputErrorClass : ""} ${
          readOnly ? "bg-surface-container text-on-surface-variant" : ""
        }`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        readOnly={readOnly}
        onBlur={onBlur}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </FieldShell>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  className?: string;
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
  required,
  hint,
  placeholder = "Selecciona…",
  className,
}: SelectFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <select
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} ${error ? inputErrorClass : ""}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  error,
  required,
  hint,
  placeholder,
  rows = 3,
  className,
}: TextAreaFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className={`${inputClass} resize-y ${error ? inputErrorClass : ""}`}
        placeholder={placeholder}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </FieldShell>
  );
}

interface RadioGroupProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  hint?: string;
  columns?: boolean;
}

export function RadioGroup({
  name,
  label,
  value,
  onChange,
  options,
  error,
  required,
  hint,
  columns,
}: RadioGroupProps) {
  return (
    <FieldShell
      id={`${name}-${options[0]?.value ?? "option"}`}
      label={label}
      required={required}
      error={error}
      hint={hint}
    >
      <div
        role="radiogroup"
        aria-label={label}
        aria-invalid={error ? "true" : undefined}
        className={`flex flex-wrap gap-2 ${columns ? "sm:grid sm:grid-cols-2" : ""}`}
      >
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const active = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "border-primary bg-primary-container text-on-primary-container"
                  : "border-outline-variant/60 bg-surface-container-low text-on-surface-variant hover:border-primary/40 hover:text-on-surface"
              }`}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={active}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`grid size-4 place-items-center rounded-full border-2 ${
                  active ? "border-primary bg-primary" : "border-outline-variant"
                }`}
              >
                {active && <span className="size-1.5 rounded-full bg-white" />}
              </span>
              {option.label}
            </label>
          );
        })}
      </div>
    </FieldShell>
  );
}

interface CheckboxFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
  className?: string;
}

export function CheckboxField({
  id,
  label,
  checked,
  onChange,
  hint,
  className,
}: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-xl border border-outline-variant/60 bg-surface-container-low px-3.5 py-3 transition-colors hover:border-primary/40 ${className ?? ""}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors ${
          checked
            ? "border-primary bg-primary text-white"
            : "border-outline-variant bg-surface-container-lowest"
        }`}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-on-surface">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-[0.7rem] font-medium leading-snug text-on-surface-variant">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}

interface YesNoFieldProps {
  name: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string;
  hint?: string;
}

export function YesNoField({
  name,
  label,
  value,
  onChange,
  error,
  hint,
}: YesNoFieldProps) {
  return (
    <FieldShell id={`${name}-si`} label={label} error={error} hint={hint}>
      <div className="inline-flex rounded-full border border-outline-variant/60 bg-surface-container-low p-1">
        {[
          { label: "Sí", checked: value, id: `${name}-si` },
          { label: "No", checked: !value, id: `${name}-no` },
        ].map((option) => (
          <label
            key={option.id}
            htmlFor={option.id}
            className={`cursor-pointer rounded-full px-5 py-1.5 text-sm font-bold transition-colors ${
              option.checked
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <input
              id={option.id}
              type="radio"
              name={name}
              checked={option.checked}
              onChange={() => onChange(option.label === "Sí")}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </FieldShell>
  );
}

interface SectionCardProps {
  id: string;
  step: number;
  title: string;
  description?: string;
  icon: LucideIcon;
  tone?: "primary" | "secondary" | "tertiary" | "sun";
  progress?: { completos: number; total: number };
  children: ReactNode;
}

const TONES = {
  primary: "bg-primary-container text-primary",
  secondary: "bg-secondary-container text-secondary",
  tertiary: "bg-tertiary-container text-tertiary",
  sun: "bg-sun-container text-on-sun-container",
};

export function SectionCard({
  id,
  step,
  title,
  description,
  icon: Icon,
  tone = "primary",
  progress,
  children,
}: SectionCardProps) {
  const completo = progress ? progress.total > 0 && progress.completos === progress.total : false;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-40 overflow-hidden rounded-[1.5rem] border border-outline-variant/50 bg-surface-container-lowest shadow-[0_18px_40px_-34px_rgba(31,48,56,0.35)] sm:rounded-[1.75rem]"
    >
      <header className="flex flex-wrap items-center gap-3 border-b border-outline-variant/40 bg-surface-container-low px-4 py-3.5 sm:px-5">
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${TONES[tone]}`}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-on-surface-variant">
              Sección {step}
            </span>
            {completo && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2 py-0.5 text-[0.58rem] font-extrabold uppercase tracking-[0.08em] text-on-secondary-container">
                <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                Completa
              </span>
            )}
          </div>
          <h2
            id={`${id}-title`}
            className="font-display text-lg font-extrabold leading-tight text-on-surface sm:text-xl"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-xs font-medium leading-snug text-on-surface-variant">
              {description}
            </p>
          )}
        </div>
        {progress && progress.total > 0 && (
          <span className="rounded-full bg-surface-container-high px-3 py-1 text-[0.65rem] font-extrabold text-on-surface-variant">
            {progress.completos}/{progress.total}
          </span>
        )}
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function FormRow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>{children}</div>;
}
