import { searchSchema } from "@/lib/forms/schemas";
import { clientIp, json, rateLimit, rowsToHtml, sendMail } from "@/lib/forms/server";

export async function POST(req: Request) {
  if (!rateLimit(`search:${clientIp(req)}`)) {
    return json(429, { error: "Trop de demandes envoyées. Réessayez dans quelques minutes." });
  }
  const parsed = searchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json(400, { error: "Certains champs sont invalides." });
  const d = parsed.data;
  if (d.website) return json(200, { ok: true });

  const res = await sendMail({
    subject: `Recherche personnalisée · ${d.vehicleType}${d.brands ? ` ${d.brands}` : ""} · ${d.budgetMax} € · ${d.name}`,
    replyTo: d.email,
    html: rowsToHtml("Nouvelle recherche personnalisée", [
      ["Type de véhicule", d.vehicleType],
      ["Marque(s)", d.brands],
      ["Modèle(s)", d.models],
      ["Neuf / occasion", d.condition],
      ["Budget max", `${d.budgetMax} €`],
      ["Mode d'achat", d.financing],
      ["Année min.", d.yearMin],
      ["Km max.", d.kmMax],
      ["Énergie", d.fuel.join(", ")],
      ["Boîte", d.transmission],
      ["Options indispensables", d.mustHave],
      ["Couleurs", d.colors],
      ["Délai", d.deadline],
      ["Reprise", d.tradeIn === "oui" ? `Oui : ${d.tradeInDetails ?? ""}` : "Non"],
      ["Client", d.customerType === "professionnel" ? `Professionnel ${d.company ?? ""}` : "Particulier"],
      ["Nom", d.name],
      ["E-mail", d.email],
      ["Téléphone", d.phone],
      ["Recontact par", d.contactPreference],
      ["Commentaire", d.comment],
    ]),
  });
  if (!res.ok) return json(502, { error: "L'envoi a échoué. Réessayez ou appelez-nous au +352 691 452 770." });
  return json(200, { ok: true });
}
