import data from "../content/vehicles.json";

type Redirect = { source: string; destination: string; permanent: true };

// Next matches `source` against the decoded path; encode non-ASCII legacy slugs both ways to be safe.
function variants(path: string): string[] {
  const encoded = encodeURI(path);
  return encoded === path ? [path] : [path, encoded];
}

/** 301s from every known IONOS URL to its new home. */
export function legacyRedirects(): Redirect[] {
  const map = new Map<string, string>([
    ["/vendu", "/vendus"],
    ["/nos-services", "/services"],
    ["/recherchepersonnalisee", "/recherche-personnalisee"],
    ["/contactez-nous", "/contact"],
    ["/demand-information", "/contact"],
    ["/newsletter-registration", "/contact"],
    ["/home", "/"],
  ]);
  for (const v of data.vehicles) {
    if (!v.legacyUrl) continue;
    map.set(v.legacyUrl, v.status === "vendu" ? "/vendus" : `/vehicules/${v.slug}`);
  }
  for (const r of data.soldReferences) if (r.legacyUrl) map.set(r.legacyUrl, "/vendus");
  for (const r of data.rental) if (r.legacyUrl) map.set(r.legacyUrl, "/location");

  return [...map].flatMap(([from, to]) =>
    from === to ? [] : variants(from).map((source) => ({ source, destination: to, permanent: true as const })),
  );
}
