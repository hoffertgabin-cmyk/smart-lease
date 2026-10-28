import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/utils";

type Crumb = { name: string; path: string };

export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  crumbs: Crumb[];
  children?: React.ReactNode;
  className?: string;
}) {
  const all = [{ name: "Accueil", path: "/" }, ...crumbs];
  return (
    <div className={cn("border-b border-line pb-12 pt-8 md:pb-16 md:pt-10", className)}>
      <div className="container-site">
        <nav aria-label="Fil d'Ariane" className="mb-10 text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden>/</span> : null}
                {i === all.length - 1 ? (
                  <span aria-current="page" className="text-ink">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path} className="hover:text-ink">
                    {c.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="grid gap-6 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end md:gap-12">
          <div>
            {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
            <h1 className="text-display-xl">{title}</h1>
          </div>
          {intro ? <div className="max-w-[52ch] text-lg text-muted">{intro}</div> : null}
        </div>
        {children}
      </div>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  action?: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-10 grid gap-4 md:mb-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-end md:gap-12">
      <div>
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h2 id={id} className="text-display-lg">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
        {intro ? <div className="max-w-[52ch] text-muted">{intro}</div> : <span />}
        {action}
      </div>
    </div>
  );
}
