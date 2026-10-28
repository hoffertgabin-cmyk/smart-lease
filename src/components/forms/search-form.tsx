"use client";

import { useRef, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { searchSchema, type SearchInput, type SearchOutput } from "@/lib/forms/schemas";
import { Button } from "@/components/ui/button";
import { Choice, ChoiceGroup, Field, Input, Select, Textarea } from "@/components/ui/field";
import { ConsentCheckbox, FormError, FormSuccess, Honeypot, postJson, type SubmitState } from "./form-status";

type Step = { title: string; fields: FieldPath<SearchInput>[] };
const steps: Step[] = [
  { title: "Votre projet", fields: ["vehicleType", "brands", "models", "condition"] },
  { title: "Budget", fields: ["budgetMax", "financing", "yearMin", "kmMax"] },
  { title: "Motorisation", fields: ["fuel", "transmission"] },
  { title: "Équipements et délai", fields: ["mustHave", "colors", "deadline"] },
  { title: "Reprise", fields: ["tradeIn", "tradeInDetails"] },
  { title: "Vos coordonnées", fields: ["customerType", "company", "name", "email", "phone", "contactPreference", "comment", "consent"] },
];

const vehicleTypes: [SearchInput["vehicleType"], string][] = [
  ["citadine", "Citadine"],
  ["compacte", "Compacte"],
  ["berline", "Berline"],
  ["break", "Break"],
  ["suv", "SUV"],
  ["coupe", "Coupé"],
  ["cabriolet", "Cabriolet"],
  ["monospace", "Monospace"],
  ["utilitaire", "Utilitaire"],
  ["indifferent", "Peu importe"],
];

export function SearchForm() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SearchInput, unknown, SearchOutput>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      condition: "indifferent",
      financing: "a-discuter",
      transmission: "indifferent",
      fuel: [],
      deadline: "1-mois",
      tradeIn: "non",
      customerType: "particulier",
      contactPreference: "telephone",
      website: "",
    },
    mode: "onTouched",
  });

  const go = (to: number) => {
    setStep(to);
    requestAnimationFrame(() => headingRef.current?.focus());
  };
  const next = async () => {
    if (await trigger(steps[step].fields)) go(step + 1);
  };

  if (state.kind === "success") {
    return (
      <FormSuccess title="Votre cahier des charges est bien reçu.">
        <p>Nous lançons la recherche auprès de nos partenaires et revenons vers vous avec des propositions.</p>
      </FormSuccess>
    );
  }

  const err = (k: FieldPath<SearchInput>) => {
    const e = k.split(".").reduce<unknown>((o, key) => (o as Record<string, unknown> | undefined)?.[key], errors) as
      | { message?: string }
      | undefined;
    return e?.message;
  };
  const aria = (k: FieldPath<SearchInput>) => (err(k) ? { "aria-invalid": true as const, "aria-describedby": `s-${k}-error` } : {});
  const isLast = step === steps.length - 1;
  const tradeIn = watch("tradeIn");
  const customerType = watch("customerType");

  return (
    <form
      noValidate
      className="relative grid gap-8"
      onSubmit={handleSubmit(async (data) => setState(await postJson("/api/recherche", data)))}
    >
      <Honeypot register={() => register("website")} />
      <div className="grid gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <p className="tabular-nums font-semibold text-sm text-accent">
            Étape {step + 1} sur {steps.length}
          </p>
          <p className="text-sm text-muted">{steps[step + 1] ? `Ensuite : ${steps[step + 1].title}` : "Dernière étape"}</p>
        </div>
        <div
          role="progressbar"
          aria-label="Progression du formulaire"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
          className="h-1 w-full bg-line"
        >
          <div className="h-full bg-accent transition-[width] duration-500 ease-out-soft" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="mt-4 text-display-md focus:outline-none">
          {steps[step].title}
        </h2>
      </div>

      {step === 0 ? (
        <div className="grid gap-6">
          <ChoiceGroup legend="Type de véhicule *" name="s-vehicleType" error={err("vehicleType")}>
            {vehicleTypes.map(([value, label]) => (
              <Choice key={value} label={label} value={value} {...register("vehicleType")} />
            ))}
          </ChoiceGroup>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Marque(s) souhaitée(s)" htmlFor="s-brands" hint="Ex. Porsche, Audi">
              <Input id="s-brands" {...register("brands")} />
            </Field>
            <Field label="Modèle(s)" htmlFor="s-models" hint="Ex. 911, RS Q3">
              <Input id="s-models" {...register("models")} />
            </Field>
          </div>
          <ChoiceGroup legend="Neuf ou occasion" name="s-condition" error={err("condition")}>
            <Choice label="Neuf" value="neuf" {...register("condition")} />
            <Choice label="Occasion récente" value="occasion" {...register("condition")} />
            <Choice label="Peu importe" value="indifferent" {...register("condition")} />
          </ChoiceGroup>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Budget maximum (€)" htmlFor="s-budgetMax" error={err("budgetMax")} required>
              <Input id="s-budgetMax" inputMode="numeric" placeholder="45000" {...register("budgetMax")} {...aria("budgetMax")} />
            </Field>
            <Field label="Mode d'achat" htmlFor="s-financing">
              <Select id="s-financing" {...register("financing")}>
                <option value="comptant">Comptant</option>
                <option value="credit">Crédit classique</option>
                <option value="loa">LOA</option>
                <option value="lld">LLD</option>
                <option value="a-discuter">À discuter</option>
              </Select>
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Année minimum" htmlFor="s-yearMin" error={err("yearMin")}>
              <Input id="s-yearMin" inputMode="numeric" placeholder="2021" {...register("yearMin")} {...aria("yearMin")} />
            </Field>
            <Field label="Kilométrage maximum" htmlFor="s-kmMax" error={err("kmMax")}>
              <Input id="s-kmMax" inputMode="numeric" placeholder="50000" {...register("kmMax")} {...aria("kmMax")} />
            </Field>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-6">
          <ChoiceGroup legend="Énergie (plusieurs choix possibles) *" name="s-fuel" error={err("fuel")}>
            {[
              ["essence", "Essence"],
              ["diesel", "Diesel"],
              ["hybride", "Hybride"],
              ["hybride-rechargeable", "Hybride rechargeable"],
              ["electrique", "Électrique"],
              ["indifferent", "Peu importe"],
            ].map(([value, label]) => (
              <Choice key={value} type="checkbox" label={label} value={value} {...register("fuel")} />
            ))}
          </ChoiceGroup>
          <ChoiceGroup legend="Boîte de vitesses" name="s-transmission">
            <Choice label="Automatique" value="automatique" {...register("transmission")} />
            <Choice label="Manuelle" value="manuelle" {...register("transmission")} />
            <Choice label="Peu importe" value="indifferent" {...register("transmission")} />
          </ChoiceGroup>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-6">
          <Field label="Options indispensables" htmlFor="s-mustHave" hint="Ex. toit ouvrant, attelage, sièges chauffants, pack sport">
            <Textarea id="s-mustHave" rows={4} {...register("mustHave")} />
          </Field>
          <Field label="Couleurs souhaitées (extérieur / intérieur)" htmlFor="s-colors">
            <Input id="s-colors" {...register("colors")} />
          </Field>
          <ChoiceGroup legend="Délai souhaité" name="s-deadline">
            <Choice label="Au plus vite" value="urgent" {...register("deadline")} />
            <Choice label="Sous un mois" value="1-mois" {...register("deadline")} />
            <Choice label="Sous trois mois" value="3-mois" {...register("deadline")} />
            <Choice label="Pas pressé" value="pas-presse" {...register("deadline")} />
          </ChoiceGroup>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="grid gap-6">
          <ChoiceGroup legend="Avez-vous un véhicule à faire reprendre ?" name="s-tradeIn">
            <Choice label="Oui" value="oui" {...register("tradeIn")} />
            <Choice label="Non" value="non" {...register("tradeIn")} />
          </ChoiceGroup>
          {tradeIn === "oui" ? (
            <Field label="Votre véhicule actuel" htmlFor="s-tradeInDetails" hint="Marque, modèle, année, kilométrage">
              <Textarea id="s-tradeInDetails" rows={3} {...register("tradeInDetails")} />
            </Field>
          ) : null}
        </div>
      ) : null}

      {step === 5 ? (
        <div className="grid gap-6">
          <ChoiceGroup legend="Vous êtes" name="s-customerType">
            <Choice label="Particulier" value="particulier" {...register("customerType")} />
            <Choice label="Professionnel" value="professionnel" {...register("customerType")} />
          </ChoiceGroup>
          {customerType === "professionnel" ? (
            <Field label="Société" htmlFor="s-company">
              <Input id="s-company" autoComplete="organization" {...register("company")} />
            </Field>
          ) : null}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nom et prénom" htmlFor="s-name" error={err("name")} required>
              <Input id="s-name" autoComplete="name" {...register("name")} {...aria("name")} />
            </Field>
            <Field label="Téléphone" htmlFor="s-phone" error={err("phone")} required>
              <Input id="s-phone" type="tel" autoComplete="tel" {...register("phone")} {...aria("phone")} />
            </Field>
          </div>
          <Field label="E-mail" htmlFor="s-email" error={err("email")} required>
            <Input id="s-email" type="email" autoComplete="email" {...register("email")} {...aria("email")} />
          </Field>
          <ChoiceGroup legend="Vous préférez être recontacté par" name="s-contactPreference">
            <Choice label="Téléphone" value="telephone" {...register("contactPreference")} />
            <Choice label="E-mail" value="email" {...register("contactPreference")} />
            <Choice label="WhatsApp" value="whatsapp" {...register("contactPreference")} />
          </ChoiceGroup>
          <Field label="Commentaire" htmlFor="s-comment">
            <Textarea id="s-comment" rows={3} {...register("comment")} />
          </Field>
          <ConsentCheckbox register={() => register("consent")} error={err("consent")} />
        </div>
      ) : null}

      {state.kind === "error" ? <FormError message={state.message} /> : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={() => go(step - 1)}>
            <ArrowLeft aria-hidden /> Retour
          </Button>
        ) : (
          <span />
        )}
        {isLast ? (
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours…" : "Envoyer ma recherche"}
          </Button>
        ) : (
          <Button type="button" size="lg" onClick={next}>
            Continuer
          </Button>
        )}
      </div>
    </form>
  );
}
