import { CheckCircle2, AlertCircle } from "lucide-react";
import { site, telHref } from "@/lib/site";

export type SubmitState = { kind: "idle" } | { kind: "success" } | { kind: "error"; message: string };

export function FormSuccess({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div role="status" className="grid gap-3 border border-accent bg-accent-soft p-6 md:p-8">
      <CheckCircle2 aria-hidden className="size-7 text-accent" />
      <p className="font-display text-2xl">{title}</p>
      <div className="text-muted">
        {children ?? <p>Nous revenons vers vous rapidement, en général dans la journée.</p>}
      </div>
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <div role="alert" className="flex gap-3 border border-danger/40 bg-[#fbeeec] p-4 text-sm text-danger">
      <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
      <p>
        {message} Vous pouvez aussi nous joindre au{" "}
        <a href={telHref} className="font-medium underline">
          {site.phone.display}
        </a>
        .
      </p>
    </div>
  );
}

export function Honeypot({ register }: { register: () => object }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Ne pas remplir
        <input type="text" tabIndex={-1} autoComplete="off" {...register()} />
      </label>
    </div>
  );
}

export function ConsentCheckbox({ register, error }: { register: () => object; error?: string }) {
  return (
    <div className="grid gap-2">
      <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          className="mt-0.5 size-5 shrink-0 accent-[var(--color-accent)]"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "consent-error" : undefined}
          {...register()}
        />
        <span>
          J&apos;accepte que Smart Lease utilise ces informations pour me répondre. Voir la{" "}
          <a href="/confidentialite" className="underline underline-offset-2">
            politique de confidentialité
          </a>
          .
        </span>
      </label>
      {error ? (
        <p id="consent-error" role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export async function postJson(url: string, body: unknown): Promise<SubmitState> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) return { kind: "success" };
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { kind: "error", message: data.error ?? "L'envoi a échoué." };
  } catch {
    return { kind: "error", message: "Connexion impossible, vérifiez votre réseau." };
  }
}
