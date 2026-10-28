import * as React from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-md border border-line bg-paper px-4 text-base text-ink placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-danger";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(control, "h-12", className)} {...props} />,
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => <textarea ref={ref} className={cn(control, "min-h-32 py-3", className)} {...props} />,
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        control,
        "h-12 appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10",
        "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23131614' stroke-width='1.5'/%3E%3C/svg%3E\")]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium text-ink", className)} {...props} />;
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-sm text-danger">
      {message}
    </p>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span aria-hidden="true" className="text-accent"> *</span> : null}
      </Label>
      {children}
      {hint ? (
        <p id={`${htmlFor}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      <FieldError id={`${htmlFor}-error`} message={error} />
    </div>
  );
}

export function ChoiceGroup({
  legend,
  children,
  error,
  name,
  className,
}: {
  legend: string;
  children: React.ReactNode;
  error?: string;
  name: string;
  className?: string;
}) {
  return (
    <fieldset className={cn("flex flex-col gap-3", className)} aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-1 text-sm font-medium text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      <FieldError id={`${name}-error`} message={error} />
    </fieldset>
  );
}

/** Pill-shaped checkbox or radio. */
export const Choice = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, className, type = "radio", ...props }, ref) => (
  <label
    className={cn(
      "relative inline-flex cursor-pointer items-center rounded-full border border-line bg-paper px-4 py-2 text-sm transition-colors",
      "has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:checked]:text-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
      className,
    )}
  >
    <input ref={ref} type={type} className="sr-only" {...props} />
    {label}
  </label>
));
Choice.displayName = "Choice";
