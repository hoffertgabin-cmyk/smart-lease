"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/forms/schemas";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ConsentCheckbox, FormError, FormSuccess, Honeypot, postJson, type SubmitState } from "./form-status";

const subjectOptions: { value: ContactInput["subject"]; label: string }[] = [
  { value: "information", label: "Demande d'information" },
  { value: "rendez-vous", label: "Prendre rendez-vous" },
  { value: "devis-pro", label: "Devis professionnel" },
  { value: "location", label: "Location" },
  { value: "autre", label: "Autre" },
];

export function ContactForm({
  vehicle,
  defaultSubject = "information",
  idPrefix = "contact",
}: {
  vehicle?: string;
  defaultSubject?: ContactInput["subject"];
  idPrefix?: string;
}) {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: defaultSubject,
      vehicle,
      message: vehicle ? `Bonjour, je suis intéressé(e) par le véhicule « ${vehicle} ». Est-il toujours disponible ?` : "",
      website: "",
    },
  });

  if (state.kind === "success") return <FormSuccess title="Message envoyé, merci." />;

  const id = (k: string) => `${idPrefix}-${k}`;
  const aria = (k: keyof ContactInput) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${id(k)}-error` } : {};

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (data) => setState(await postJson("/api/contact", data)))}
      className="relative grid gap-5"
    >
      <Honeypot register={() => register("website")} />
      {vehicle ? <input type="hidden" {...register("vehicle")} /> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom et prénom" htmlFor={id("name")} error={errors.name?.message} required>
          <Input id={id("name")} autoComplete="name" {...register("name")} {...aria("name")} />
        </Field>
        <Field label="Téléphone" htmlFor={id("phone")} error={errors.phone?.message}>
          <Input id={id("phone")} type="tel" autoComplete="tel" inputMode="tel" {...register("phone")} {...aria("phone")} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="E-mail" htmlFor={id("email")} error={errors.email?.message} required>
          <Input id={id("email")} type="email" autoComplete="email" {...register("email")} {...aria("email")} />
        </Field>
        <Field label="Objet" htmlFor={id("subject")}>
          <Select id={id("subject")} {...register("subject")}>
            {subjectOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      {vehicle ? (
        <p className="text-sm text-muted">
          Véhicule concerné : <span className="font-medium text-ink">{vehicle}</span>
        </p>
      ) : null}
      <Field label="Message" htmlFor={id("message")} error={errors.message?.message} required>
        <Textarea id={id("message")} rows={5} {...register("message")} {...aria("message")} />
      </Field>
      <ConsentCheckbox register={() => register("consent")} error={errors.consent?.message} />
      {state.kind === "error" ? <FormError message={state.message} /> : null}
      <div>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours…" : "Envoyer"}
        </Button>
      </div>
    </form>
  );
}
