import { importSteps } from "@/content/services";

export function ImportSteps({ vertical = false }: { vertical?: boolean }) {
  const h = (cls: string) => (vertical ? "" : cls);
  return (
    <ol className={`relative grid gap-0 ${h("md:grid-cols-4 md:gap-8")}`}>
      <span aria-hidden className={`absolute bottom-0 left-[5px] top-0 w-px bg-line ${h("md:bottom-auto md:left-0 md:right-0 md:top-[9px] md:h-px md:w-auto")}`} />
      {importSteps.map((step, i) => (
        <li key={step.title} className={`relative min-w-0 pb-8 pl-9 ${h("md:pb-0 md:pl-0 md:pt-10")}`}>
          <span
            aria-hidden
            className={
              `absolute left-0 top-1.5 size-[11px] rounded-full border border-accent ${h("md:top-1")} ` +
              (i === importSteps.length - 1 ? "bg-accent" : "bg-paper")
            }
          />
          <p className="font-mono text-[0.8125rem] text-accent">Étape {i + 1}</p>
          <h3 className="mb-2.5 mt-2 text-2xl">{step.title}</h3>
          <p className="text-[0.9375rem] text-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
