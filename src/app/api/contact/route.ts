import { contactSchema } from "@/lib/forms/schemas";
import { clientIp, json, rateLimit, rowsToHtml, sendMail } from "@/lib/forms/server";

const subjects = {
  information: "Demande d'information",
  "rendez-vous": "Demande de rendez-vous",
  "devis-pro": "Demande de devis professionnel",
  location: "Demande de location",
  autre: "Message",
} as const;

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req)}`)) {
    return json(429, { error: "Trop de messages envoyés. Réessayez dans quelques minutes ou appelez-nous." });
  }
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json(400, { error: "Certains champs sont invalides." });
  const d = parsed.data;
  if (d.website) return json(200, { ok: true }); // honeypot: pretend success

  const subject = `${subjects[d.subject]}${d.vehicle ? ` · ${d.vehicle}` : ""} · ${d.name}`;
  const res = await sendMail({
    subject,
    replyTo: d.email,
    html: rowsToHtml(subjects[d.subject], [
      ["Véhicule", d.vehicle],
      ["Nom", d.name],
      ["E-mail", d.email],
      ["Téléphone", d.phone],
      ["Message", d.message],
    ]),
  });
  if (!res.ok) return json(502, { error: "L'envoi a échoué. Réessayez ou appelez-nous au +352 691 452 770." });
  return json(200, { ok: true });
}
