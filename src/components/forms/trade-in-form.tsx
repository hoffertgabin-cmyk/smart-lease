"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tradeInSchema, UPLOAD_LIMITS, type TradeInInput, type TradeInOutput } from "@/lib/forms/schemas";
import { Button } from "@/components/ui/button";
import { Choice, ChoiceGroup, Field, Input, Select, Textarea } from "@/components/ui/field";
import { ConsentCheckbox, FormError, FormSuccess, Honeypot, type SubmitState } from "./form-status";
import { FileUpload } from "./file-upload";

export function TradeInForm() {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const [photos, setPhotos] = useState<File[]>([]);
  const [registration, setRegistration] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TradeInInput, unknown, TradeInOutput>({
    resolver: zodResolver(tradeInSchema),
    defaultValues: { fuel: "diesel", transmission: "automatique", wish: "reprise", website: "" },
  });

  if (state.kind === "success") {
    return (
      <FormSuccess title="Demande d'estimation reçue.">
        <p>Nous étudions votre véhicule et revenons vers vous avec une proposition de reprise ou de dépôt-vente.</p>
      </FormSuccess>
    );
  }

  const aria = (k: keyof TradeInInput) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `t-${k}-error` } : {});

  const onSubmit = handleSubmit(async (data) => {
    const all = [...photos, ...registration];
    const total = all.reduce((n, f) => n + f.size, 0);
    if (total > UPLOAD_LIMITS.maxTotalBytes) {
      setFileError("Les fichiers dépassent 4 Mo au total. Retirez quelques photos ou envoyez-les ensuite par WhatsApp.");
      return;
    }
    setFileError(undefined);
    const body = new FormData();
    body.set("data", JSON.stringify(data));
    photos.forEach((f) => body.append("photos", f));
    registration.forEach((f) => body.append("registration", f));
    try {
      const res = await fetch("/api/reprise", { method: "POST", body });
      if (res.ok) return setState({ kind: "success" });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      setState({ kind: "error", message: json.error ?? "L'envoi a échoué." });
    } catch {
      setState({ kind: "error", message: "Connexion impossible, vérifiez votre réseau." });
    }
  });

  return (
    <form noValidate onSubmit={onSubmit} className="relative grid gap-8">
      <Honeypot register={() => register("website")} />
      <fieldset className="grid gap-5">
        <legend className="mb-5 font-display text-2xl">Votre véhicule</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Marque" htmlFor="t-brand" error={errors.brand?.message} required>
            <Input id="t-brand" {...register("brand")} {...aria("brand")} />
          </Field>
          <Field label="Modèle et version" htmlFor="t-model" error={errors.model?.message} required>
            <Input id="t-model" {...register("model")} {...aria("model")} />
          </Field>
          <Field label="Année" htmlFor="t-year" error={errors.year?.message} required>
            <Input id="t-year" inputMode="numeric" placeholder="2020" {...register("year")} {...aria("year")} />
          </Field>
          <Field label="Kilométrage" htmlFor="t-mileageKm" error={errors.mileageKm?.message} required>
            <Input id="t-mileageKm" inputMode="numeric" placeholder="65000" {...register("mileageKm")} {...aria("mileageKm")} />
          </Field>
          <Field label="Énergie" htmlFor="t-fuel">
            <Select id="t-fuel" {...register("fuel")}>
              <option value="essence">Essence</option>
              <option value="diesel">Diesel</option>
              <option value="hybride">Hybride</option>
              <option value="hybride-rechargeable">Hybride rechargeable</option>
              <option value="electrique">Électrique</option>
              <option value="gpl">GPL</option>
            </Select>
          </Field>
          <Field label="Boîte" htmlFor="t-transmission">
            <Select id="t-transmission" {...register("transmission")}>
              <option value="automatique">Automatique</option>
              <option value="manuelle">Manuelle</option>
            </Select>
          </Field>
        </div>
        <Field label="État, entretien, options" htmlFor="t-condition" hint="Carnet d'entretien, défauts éventuels, options importantes">
          <Textarea id="t-condition" rows={4} {...register("condition")} />
        </Field>
        <ChoiceGroup legend="Vous souhaitez" name="t-wish">
          <Choice label="Une reprise" value="reprise" {...register("wish")} />
          <Choice label="Un dépôt-vente" value="depot-vente" {...register("wish")} />
          <Choice label="Les deux options" value="les-deux" {...register("wish")} />
        </ChoiceGroup>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="mb-5 font-display text-2xl">Photos et carte grise</legend>
        <FileUpload
          label="Photos du véhicule"
          hint={`Jusqu'à ${UPLOAD_LIMITS.maxFiles} photos : extérieur, intérieur, compteur. Réduites automatiquement.`}
          accept="image/*"
          multiple
          files={photos}
          onChange={setPhotos}
        />
        <FileUpload
          label="Carte grise (certificat d'immatriculation)"
          hint="Photo ou PDF"
          accept="image/*,application/pdf"
          files={registration}
          onChange={setRegistration}
          error={fileError}
        />
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="mb-5 font-display text-2xl">Vos coordonnées</legend>
        <Field label="Nom et prénom" htmlFor="t-name" error={errors.name?.message} required>
          <Input id="t-name" autoComplete="name" {...register("name")} {...aria("name")} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Téléphone" htmlFor="t-phone" error={errors.phone?.message} required>
            <Input id="t-phone" type="tel" autoComplete="tel" {...register("phone")} {...aria("phone")} />
          </Field>
          <Field label="E-mail" htmlFor="t-email" error={errors.email?.message} required>
            <Input id="t-email" type="email" autoComplete="email" {...register("email")} {...aria("email")} />
          </Field>
        </div>
        <ConsentCheckbox register={() => register("consent")} error={errors.consent?.message} />
      </fieldset>

      {state.kind === "error" ? <FormError message={state.message} /> : null}
      <div>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours…" : "Demander mon estimation"}
        </Button>
      </div>
    </form>
  );
}
